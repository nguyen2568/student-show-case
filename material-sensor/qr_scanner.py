import json, os, time, ssl, signal, sys
from gpiozero import DigitalInputDevice
from picamera2 import Picamera2
from pyzbar.pyzbar import decode
import paho.mqtt.client as mqtt
from utils import decrypt_qr_data  # Import the decryption function
from dotenv import load_dotenv, find_dotenv
import RPi.GPIO as GPIO  # Add this import

# ─────────────────────────── Environment setup ────────────────────────────────
load_dotenv(find_dotenv())  # Load environment variables from .env file
# ─────────────────────────── Configuration from ENV ────────────────────────────

BIN_ID = os.getenv("BIN_ID", "device")
AWS_IOT_EP = os.getenv("AWS_IOT_ENDPOINT")
AWS_IOT_CERT = os.getenv("AWS_IOT_CERT")
AWS_IOT_KEY = os.getenv("AWS_IOT_KEY")
AWS_IOT_CA = os.getenv("AWS_IOT_CA")
TOPIC = os.getenv("AWS_IOT_TOPIC")
CLIENT_ID = "device"

print(f"Cert: {AWS_IOT_CERT}")
awsport = 8883
client_id = "device"       # Name your device (must match AWS IoT Thing name if you defined one)
topic = "innovation/recycle_events"     # Customize this as needed

# ─────────────────────────── GPIO / Camera setup ────────────────────────────
METAL_PIN   = 17   # metal / can
PLASTIC_PIN = 27   # plastic / bottle

def init_sensor(pin: int, name: str, *, pull_up: bool):
    return DigitalInputDevice(pin, pull_up=pull_up, bounce_time=2)

metal   = init_sensor(17, "METAL",   pull_up=False)   # PNP‑NO via opto
plastic = init_sensor(27, "PLASTIC", pull_up=False)   # NPN‑NO via opto
picam2 = Picamera2()
picam2.configure(picam2.create_preview_configuration(main={"size": (640, 480)}))
picam2.start()
time.sleep(2)  # Camera warm-up

# ─────────────────────────── ACTIVE BUZZER SETUP ──────────────────────────────────────
BUZZER_PIN = 22  # Change to your actual GPIO pin number
GPIO.setmode(GPIO.BCM)
GPIO.setup(BUZZER_PIN, GPIO.OUT)
GPIO.output(BUZZER_PIN, GPIO.LOW)  # Ensure buzzer is off initially
def buzz(duration=0.2):
    GPIO.output(BUZZER_PIN, GPIO.HIGH)  # Turn on the buzzer
    time.sleep(duration)                # Wait for the specified duration
    GPIO.output(BUZZER_PIN, GPIO.LOW)   # Turn off the buzzer
# ─────────────────────────── MQTT setup (TLS) ──────────────────────────────────

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2,client_id)
client.tls_set(ca_certs=AWS_IOT_CA,
               certfile=AWS_IOT_CERT,
               keyfile=AWS_IOT_KEY,
               cert_reqs=ssl.CERT_REQUIRED,
               tls_version=ssl.PROTOCOL_TLSv1_2,
               ciphers=None)



client.connect(AWS_IOT_EP, awsport)
# Subscribe so we can hear “FINISH” commands from the server
client.subscribe(TOPIC, qos=1)
# client.loop_start()

# ─────────────────────────── Runtime state ─────────────────────────────────────
current_user = "james"
last_qr_seen = None                 # ms epoch
DEBOUNCE_MS  = 800                  # sensor debounce

def now_ms():
    return int(time.time() * 1000)

def publish(evt_type, **extra):
    payload = {
        "type"  : evt_type,
        "binId" : BIN_ID,
        "ts"    : now_ms(),
        **extra
    }
    client.publish(TOPIC, json.dumps(payload), qos=1)

# ─────────────────────────── MQTT callback ─────────────────────────────────────

def on_message(_client, _userdata, msg):
    global current_user
    try:
        data = json.loads(msg.payload.decode())
    except ValueError:
        print("[WARN] Non‑JSON payload")
        return

    if data.get("type") == "FINISH" and data.get("binId") == BIN_ID:
        print("[INFO] FINISH received; clearing session")
        current_user = None

client.on_message = on_message

# ─────────────────────────── Graceful shutdown ─────────────────────────────────
def shutdown(signum, _frame):
    print("\n[INFO] Shutting down …")
    picam2.stop()
    picam2.close()
    client.disconnect()
    sys.exit(0)

for sig in (signal.SIGINT, signal.SIGTERM):
    signal.signal(sig, shutdown)

# ─────────────────────────── Main loop ─────────────────────────────────────────
WINDOW_MS = 1500          # 1.5‑second decision window
POLL_MS   = 50            # loop delay

last_plastic_val = plastic.is_active
last_metal_val   = metal.is_active

awaiting_metal   = False
t_plastic        = 0      # ms timestamp of last plastic trigger

print(f"[OK] Agent running for {BIN_ID}.  Press Ctrl‑C to stop.")
last_metal_ts   = 0
last_plastic_ts = 0
while True:
    # 1. Read current states
    plastic_now = plastic.is_active
    metal_now   = metal.is_active
    print(f"[DEBUG] plastic: {plastic_now}, metal: {metal_now}")

    # ── 1. Camera → QR code
    frame = picam2.capture_array()
    decoded = decode(frame)
    if decoded: 
        qr = decoded[0].data.decode()
        username = decrypt_qr_data(qr)
        if username == None:
            print("Decryption failed, skipping...")
            time.sleep(2)
            continue
        if username:
            current_user = username
            last_qr_seen = now_ms()
            publish("SCAN", username=current_user)
            print(f"[QR] {username}")

            # Beep the buzzer
            buzz()

            time.sleep(2)

    now = now_ms()

    

    # 2. Detect *rising* edges (inactive → active)
    plastic_edge = plastic_now and not last_plastic_val
    metal_edge   = metal_now   and not last_metal_val

    # 3. Handle plastic first
    if plastic_edge and current_user:
        awaiting_metal = True
        t_plastic = now
        print("object detected")
        # (no publish yet)

    # 4. Handle metal edge
    if metal_edge and current_user:
        if awaiting_metal and (now - t_plastic <= WINDOW_MS):
            # metal confirmed within window
            publish("ITEM", username=current_user, material="metal")
            print("[SENSOR] metal (1. confirmed)")
            awaiting_metal = False
        else:
            # metal arrived first or after window — still count as metal
            publish("ITEM", username=current_user, material="metal")
            print("[SENSOR] metal (2. confirmed)")

        last_metal_ts = now
        print("[SENSOR] metal")
        time.sleep(1)

    # 5. Window timeout → classify as plastic
    if awaiting_metal and (now - t_plastic > WINDOW_MS):
        print("[SENSOR] plastic (1. confirmed)", now - t_plastic)
        publish("ITEM", username=current_user, material="plastic")
        awaiting_metal = False
        last_plastic_ts = now
        print("[SENSOR] plastic")

    # 6. Update previous values for edge detection
    last_plastic_val = plastic_now
    last_metal_val   = metal_now

    # 7. MQTT keep‑alive
    client.loop(timeout=POLL_MS / 1000)
    time.sleep(POLL_MS / 1000)

