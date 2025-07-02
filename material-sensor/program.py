#!/usr/bin/env python3
# -*- coding: utf‑8 -*-
"""
Recycling bin metal sensor first, object sensor second
Using GPIO interrupt callbacks to classify each item.
"""

import json, os, time, ssl, signal, sys, threading
from gpiozero import DigitalInputDevice
from picamera2 import Picamera2
from pyzbar.pyzbar import decode
import paho.mqtt.client as mqtt
from utils import decrypt_qr_data
from dotenv import load_dotenv, find_dotenv
import RPi.GPIO as GPIO

# ─────────────── Environment / MQTT setup  ─────────────
load_dotenv(find_dotenv())
BIN_ID        = os.getenv("BIN_ID", "device")
AWS_IOT_EP    = os.getenv("AWS_IOT_ENDPOINT")
AWS_IOT_CERT  = os.getenv("AWS_IOT_CERT")
AWS_IOT_KEY   = os.getenv("AWS_IOT_KEY")
AWS_IOT_CA    = os.getenv("AWS_IOT_CA")
TOPIC         = os.getenv("AWS_IOT_TOPIC")
CLIENT_ID     = "device"
PORT          = 8883

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, CLIENT_ID)
client.tls_set(ca_certs=AWS_IOT_CA,
               certfile=AWS_IOT_CERT,
               keyfile=AWS_IOT_KEY,
               cert_reqs=ssl.CERT_REQUIRED,
               tls_version=ssl.PROTOCOL_TLSv1_2)
client.connect(AWS_IOT_EP, PORT)
client.loop_start()          # keep client alive

# ─────────────── Helper ───────────────
def now_ms() -> int:
    return int(time.time() * 1000)

def publish(evt_type, **extra):
    payload = {"type": evt_type, "binId": BIN_ID, "ts": now_ms(), **extra}
    client.publish(TOPIC, json.dumps(payload), qos=1)

# ─────────────── Camera / QR scan thread ───────────────
picam2 = Picamera2()
picam2.configure(picam2.create_preview_configuration(main={"size": (640, 480)}))
picam2.start()
time.sleep(2)

current_user = None
def qr_loop():
    global current_user
    while True:
        frame = picam2.capture_array()
        decoded = decode(frame)
        if decoded:
            username = decrypt_qr_data(decoded[0].data.decode())
            if username:
                current_user = username
                publish("SCAN", username=current_user)
                buzz()
                time.sleep(2)     
        time.sleep(0.1)

# ─────────────── Buzzer ───────────────
BUZZER_PIN = 22
GPIO.setmode(GPIO.BCM)
GPIO.setup(BUZZER_PIN, GPIO.OUT, initial=GPIO.LOW)
def buzz(dur=0.15):
    GPIO.output(BUZZER_PIN, GPIO.HIGH)
    time.sleep(dur)
    GPIO.output(BUZZER_PIN, GPIO.LOW)

# ─────────────── Sensor setup ───────────────
METAL_PIN   = 17   # metal sensor
OBJECT_PIN  = 27   # object sensor

metal   = DigitalInputDevice(METAL_PIN,  pull_up=False, bounce_time=0.05)
obj     = DigitalInputDevice(OBJECT_PIN, pull_up=False, bounce_time=0.05)

# ─────────────── FSM state ───────────────
item_is_metal = False
lock          = threading.Lock()
RESET_S       = 2         # timeout auto reset flag

def reset_flag_later():
    time.sleep(RESET_S)
    with lock:
        global item_is_metal
        item_is_metal = False
        print("Reset item_is_metal flag")

# ─────────────── Callback functions ───────────────
def on_metal():
    global item_is_metal
    with lock:
        item_is_metal = True
        if not current_user:
            item_is_metal = False
            return
        item_is_metal = True
        publish("ITEM", username=current_user, material="metal")
        print("Metal detected")
        # delete flag
        threading.Thread(target=reset_flag_later, daemon=True).start()

def on_object():
    global item_is_metal
    with lock:
        if not current_user:
            return
        if item_is_metal:
            # sent metal event
            item_is_metal = False
            return
        publish("ITEM", username=current_user, material="plastic")

metal.when_activated = on_metal
obj.when_activated   = on_object

# ─────────────── QR camera thread ───────────────
threading.Thread(target=qr_loop, daemon=True).start()

# ─────────────── Graceful shutdown ───────────────
def shutdown(sig, _frm):
    print("Shutting down…")
    picam2.stop(); picam2.close()
    client.loop_stop(); client.disconnect()
    GPIO.cleanup()
    sys.exit(0)
for s in (signal.SIGINT, signal.SIGTERM): signal.signal(s, shutdown)

print("[OK] Ready")
signal.pause()  # wait for signal