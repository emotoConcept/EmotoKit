
from __future__ import division
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

import time
import Adafruit_PCA9685


pwm = Adafruit_PCA9685.PCA9685()

servo_min = 150
servo_max = 600
currPulse = servo_min

def set_servo_pulse(channel, pulse): 
    pulse_length = 1000000
    pulse_length //= 60
    pulse_length //= 4096
    pulse *= 1000
    pulse //= pulse_length
    pwm.set_pwm(channel, 0, pulse)
pwm.set_pwm_freq(60)



class BaseRotation(WebSocket):
    currPulse = 150
    currRotPulse=225
    servo_min = 150
    servo_max = 600
    def handleMessage(self):
        if (self.data == 'left' and self.currPulse > self.servo_min):
            self.currPulse = self.currPulse-5
            pwm.set_pwm(0,0, self.currPulse)
            #set_servo_pulse(0, 500)
        elif (self.data == 'right' and self.currPulse < self.servo_max):
            self.currPulse = self.currPulse+5
            pwm.set_pwm(0, 0, self.currPulse)

        elif (self.data== 'tiltRight' and self.currRotPulse < self.servo_min):
            self.currRotPulse = self.currRotPulse + 5
            pwm.set_pwm(1, 0, self.currRotPulse)
        elif (self.data=='tiltLeft' and self.currRotPulse > self.servo_max):
            self.currRotPulse = self.currRotPulse -5 
            pwm.set_pwm(1, 0, self.currRotPulse)
        print(self.currRotPulse)
        
    """
        if (self.data == 'right' and currPulse > servo_min):
            currPulse -= 5; 
        elif (self.data == 'left' and currPulse < servo_max):
            currPulse += 5; 
        set_servo_pulse(0, currPulse)
    """

    def handleConnected(self):
        print(self.address, 'connected')
        set_servo_pulse(0, servo_max)

    def handleClose(self):
        print(self.address, 'closed')

server = SimpleWebSocketServer('', 8060, BaseRotation)
server.serveforever()
