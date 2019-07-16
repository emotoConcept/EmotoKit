# Gautam Bose
# Emoto driver that exposes functions to drive the Emotokit body
# Apr 2019
# Using Sparkfun PI-ZERO-SERVOHAT

import smbus2 as smbus
import time
from util import range_map, channel_map

class EmotoDriver(object):

    def __init__(self):
        self.bus = smbus.SMBus(1)
        self.addr = 0x40
        
        # raw angles not safe range
        # TODO: pwm values need to be correctly set
        self.min_pwm = 0
        self.max_pwm = 690
        self.min_angle = 0
        self.max_angle = 180

        prescale_value = 0x65 #set the Prescale value for 60hz, as noted in the datasheet
        prescale_register = 0xfe

        self.bus.write_byte_data(self.addr, 0, 0x20) # enable the chip
        time.sleep(.25)

        self.bus.write_byte_data(self.addr, 0, 0x10) # enable prescale change
        time.sleep(.25) # delay for reset

        self.bus.write_byte_data(self.addr, prescale_register, prescale_value)
        self.bus.write_byte_data(self.addr, 0, 0x20) # enable the chip again
        time.sleep(.25)

        print("Servo Motor Control Enabled")
        
        # set all channel start times to zero. We will only work with end times from now on
        self.bus.write_word_data(self.addr, 0x06, 0)
        self.bus.write_word_data(self.addr, 0x0a, 0)
        self.bus.write_word_data(self.addr, 0x0e, 0)
    
    # directly set a motor to a specific position as fast as possible. 
    def set_position_direct(self, channel, angle):
        
        # Clamp this range_map 
        time_at_angle = range_map(self.min_angle, self.max_angle, self.min_pwm, self.max_pwm, angle)
        hex_channel = channel_map(channel)
        self.bus.write_word_data(self.addr, hex_channel, time_at_angle)
    
    # function that takes in a dictionary object of positions and smoothly interpolates each joint to them over 
    # their given speed. 
    # Sample 'positions': 
    # def set_position_interp(self, positions):



