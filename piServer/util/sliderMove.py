from __future__ import division
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

import time
import json
import Adafruit_PCA9685

pwm = Adafruit_PCA9685.PCA9685()
pwm.set_pwm_freq(60)



class ServoSlider(WebSocket):
    
    def handleMessage(self):
        print(self.data)
        data = json.loads(self.data)
        # print(data)
        pwm.set_pwm(data['motor'], 0, data['value'])

    def handleConnected(self):
        print(self.address, 'connected')

    def handleClose(self):
        print(self.address, 'closed')

server = SimpleWebSocketServer('', 8060, ServoSlider)
server.serveforever()
