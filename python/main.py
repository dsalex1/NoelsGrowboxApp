import RPi.GPIO as GPIO
import time
import pigpio
import yaml 
import ruamel.yaml

from SHT3x import SHT3x
from BMP390 import BMP390

# started as service with: sudo systemctl status noelsgrowboxapp.service

GPIO.setwarnings(False)

# 3v3 orange
SDA_GPIO = 2 #green
SCL_GPIO = 3 #blue
LAMP_RELAY_GPIO = 23 #yellow
PWM_FAN_ANGLE_GPIO = 6 #brown
PWM_FAN_POWER_GPIO = 13 #red
PWM_VENT_POWER_GPIO = 12 #white
# GND black

ruamel = ruamel.yaml.YAML()  # defaults to round-trip if no parameters given

pwm = pigpio.pi()

sensor_SHT35 = SHT3x(address=0x44)
sensor_BMP390 = BMP390(i2c_address=0x77, i2c_bus=1)

# PWM-Frequenz in Hz
PWM_FREQ = 2000  # PWM-Frequenz auf 5 kHz setzen

GPIO.setmode(GPIO.BCM)
GPIO.setup(PWM_VENT_POWER_GPIO, GPIO.OUT)
pwmHW = GPIO.PWM(PWM_VENT_POWER_GPIO, PWM_FREQ)

# PWM starten mit 0% Duty Cycle
pwmHW.start(0)

def setup():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(LAMP_RELAY_GPIO, GPIO.OUT)

    pwm.set_mode(PWM_FAN_ANGLE_GPIO, pigpio.OUTPUT)
    pwm.set_PWM_frequency( PWM_FAN_ANGLE_GPIO, 50 )

    #pwm.set_mode(PWM_FAN_POWER_GPIO, pigpio.OUTPUT)
    #pwm.set_PWM_frequency( PWM_FAN_POWER_GPIO, 50 )
    #pwm.set_servo_pulsewidth(PWM_FAN_POWER_GPIO, 1500)
    #time.sleep(3)

    pwm.set_mode(PWM_VENT_POWER_GPIO, pigpio.OUTPUT)
    pwm.set_PWM_frequency( PWM_VENT_POWER_GPIO, 50 )


def teardown():
    GPIO.cleanup()


def toggleLamp(on):
    GPIO.output(LAMP_RELAY_GPIO, GPIO.HIGH if on else GPIO.LOW)

def setFanAngle(value):
    if value < 0: value = 0
    if value > 1: value = 1
    #fan angle mechanically bounded at 1000 min and 2400 max, with 1850 being parallel, so symetrical range is 1300-2400
    pwm.set_servo_pulsewidth(PWM_FAN_ANGLE_GPIO, (2400-1300)*value+1300)

def setFanPower(value):
    if value < 0: value = 0
    if value > 1: value = 1
    pwm.set_servo_pulsewidth(PWM_FAN_POWER_GPIO, int((2000-1530)*value+1530)) #bounds need to be checked, somehow it doenst respon anymore when it was set to 1500 once, otherwise 1500 to 2000 useable range

def setVentPower(value):
    if value < 0: value = 0
    if value > 1: value = 1
    pwmHW.start(value*100) # the ventilator needs hw pwm, which is provided on pin 12, range 0 to 100

setup()
print ("started watching 'actuators.yml' for changes, and writing sensordata into 'sensors.yml'...")

from threading import Thread

fan_angle = -1 # from 0 to 1 or -1 for off
fan_half_cycle_duration = 8 # in seconds

def fan_thread():
    direction = 1
    current_pos = 0
    FPS = 32
    while True:
        if fan_angle != -1:
            setFanAngle(fan_angle)
        else:
            if current_pos >= 1:
                direction = -1
            if current_pos <= 0:
                direction = 1
            current_pos += direction/FPS/fan_half_cycle_duration
            setFanAngle(current_pos)
            time.sleep(1/FPS)


Thread(target = fan_thread).start()

while True:
    try:
        # watch the file actuators.yml for changes, and set the actuators accordingly
        with open('actuators.yml', 'r') as file:
            data = yaml.load(file, Loader=yaml.FullLoader)
            toggleLamp(data['lamp']==True)
            setFanPower(float(data['fan_power']))
            setVentPower(float(data['vent_power']))

            fan_half_cycle_duration = (float(data['fan_half_cycle_duration']))
            fan_angle = float(data['fan_angle'])

        # read the sensors and write the sensors.yml file accordingly
        with open('sensors.yml','w') as file:
            
            sensor_SHT35.update_data()
            temperature_SHT35 = sensor_SHT35.get_temperature("Celsius") # in °C
            humidity = sensor_SHT35.get_rel_humidity() # in %

            temperature_BMP390 = sensor_BMP390.temperature # in °C
            pressure = sensor_BMP390.pressure # in 'hPa'

            yaml_str = """\
# this file contains the current sensor readings from the SHT35 and BMP390 sensors

# read from the SHT35:
temperature_SHT35: 0 # in C°
humidity: 0 # in %

#read from the BMP390:
temperature_BMP390: 0 # in C°
pressure: 0 # in hPa
"""
            code = ruamel.load(yaml_str)
            code['temperature_SHT35'] = temperature_SHT35
            code['humidity'] = humidity
            code['temperature_BMP390'] = temperature_BMP390
            code['pressure'] = pressure

            ruamel.dump(code, file)
    except Exception as e: 
        print(e) 

    time.sleep(2)

teardown()

