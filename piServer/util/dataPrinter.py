from __future__ import division
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

import time
import json

class DataPrinter(WebSocket):
    
    def handleMessage(self):
        print(json.loads(self.data))

    def handleConnected(self):
        print(self.address, 'connected')

    def handleClose(self):
        print(self.address, 'closed')

server = SimpleWebSocketServer('', 8060, DataPrinter)
server.serveforever()
