import time
import RPi.GPIO as GPIO
import paho.mqtt.client as mqtt

PIN = 17
BROKER = "broker.hivemq.com"
TOPIC = "recycle_iot/metal"

# Initialize a global counter
Counter = 0

def on_detect(channel):
    global Counter  # Declare Counter as a global variable
    if GPIO.input(PIN) == GPIO.LOW:   # metal present
        Counter += 1  # Increment the counter
        #client.publish(TOPIC, "metal_detected")
        print("Metal detected")
        print("Counter: ", Counter)

GPIO.setmode(GPIO.BCM)
GPIO.setup(PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.add_event_detect(PIN, GPIO.FALLING, callback=on_detect, bouncetime=50)

# client = mqtt.Client()
# client.connect(BROKER, 1883, 60)
# client.loop_start()

try:
    while True:
        time.sleep(60)
except KeyboardInterrupt:
    GPIO.cleanup()
    client.loop_stop()
    client.disconnect()