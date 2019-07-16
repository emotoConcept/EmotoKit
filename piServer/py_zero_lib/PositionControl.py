# Gautam Bose
# Direct Positional Control of The Servo Motors overwebsockets. 
# Apr 2019
# Uses Adafruit PCA9685 Library for PI 

from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import logging
import time
import json
import Adafruit_PCA9685

from EmotoDriver import EmotoDriver

current_milli_time = lambda: int(round(time.time() * 1000))


clients = []

class StreamingEmotoController(WebSocket):
    
    driver = EmotoDriver()
    isRecording = False
    currAnimArray = []
    currAnim = [] 
    # This function will parse the messages from our JS library and call
    # Appropriate driver functions
    def handleMessage(self):
#        print(self.data)
        message = None
        try:
            message = json.loads(self.data)
        except:
            print("invalid message format")

        if (message != None): 
            if ('type' in message and message['type'] == 'position'):
                angles = message.get('angles')
                if (angles != None):
                    for motorVal in angles:
                        try: 
                            self.driver.set_position_direct(motorVal['motor'], motorVal['value'])
                            if self.isRecording: 
                                self.currAnimArray.append({'motor': motorVal['motor'], 'value': motorVal['value'], 'timestamp': current_milli_time()})
                        except:
                            logging.exception("error")
            elif ('type' in message and message['type'] == 'startRecording'): 
                print('recording begins')
                self.currAnim = []
                self.currAnimArray = []
                for client in clients:
                    if client != self:
                        client.sendMessage(json.dumps(message)) #send start Recording and name to body to add sequence
                self.isRecording = True
            elif (message == 'stopRecording'): 
                self.isRecording = False
                print(len(self.currAnimArray))
                print("recording stopped") 
                try: 
                    self.currAnim = self.currAnimArray
                    self.currAnimArray = []
                except: 
                    logging.exception('error')
            elif (message == 'sendSignalToStop'):
                for client in clients:
                    if client != self:
                        print('senidng signal to stop to controller')
                        client.sendMessage(json.dumps('sendSignalToStopToController'))
            elif ('type' in message and message['type'] == 'playRecording'): 
                for client in clients:
                    if client != self:
                        print('sending to client')
                        client.sendMessage(json.dumps(message))
                        print('sent')
            elif ('type' in message and message['type'] == 'playBodyRecording'):

                try:
                    if len(self.currAnim) == 0:
                        try:
                            filePath = './savedAnimations/' + message['name'] + '.json'
                            print('tyring to open: ', filePath)
                            with open(filePath, 'r') as jsonFile:
                                self.currAnim = json.load(jsonFile)
                                print('file loaded')
                        except:
                            print('file could not be loaded')
                            logging.exception('error')


                    for i in range(len(self.currAnim) - 2): 
                        currMotor = self.currAnim[i]['motor']
                        currValue = self.currAnim[i]['value']
                        timeToSleep = abs(self.currAnim[i]['timestamp'] - self.currAnim[i+1]['timestamp'])
                        
                        self.driver.set_position_direct(currMotor, currValue)
                        if (i == 0):
                            print('setting to first position')
                            time.sleep(2) # Get the robot back in its initial position
                        else: 
                            time.sleep(timeToSleep / 1000.0) #otherwise delay the original message time 
                    print("animation over") 

                except: 
                    logging.exception("error")
            elif ('type' in message and message['type'] == 'saveRecording'):
                try:
                    recordingPath = './savedAnimations/%s' %  message['recordingName']
                    
                    with open(recordingPath, 'w+') as f:
                        f.write(json.dumps(self.currAnim))
                    print('recording saved as ', message['recordingName'])
                except:
                    logging.exception('error')
            elif (message == 'getSequences'):
                try:
                    for client in clients:
                        if client != self:
                            client.sendMessage(json.dumps("retrieveSequences"))
                except:
                    logging.exception('error')
            elif ('type' in message and message['type'] == 'sequenceList'):
                print("sending seqList Info")
                try:
                    for client in clients:
                        if client!= self:
                            client.sendMessage(json.dumps(message))
                except:
                    logging.exception('error')


    def handleConnected(self):
        print(self.address, 'connected')
        clients.append(self)

    def handleClose(self):
        print(self.address, 'closed')
        clients.remove(self)



server = SimpleWebSocketServer('', 8065, StreamingEmotoController)
server.serveforever()
