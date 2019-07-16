# EmotoKit
This repository contains all the code required to move emoto in the animations shown in our [concept video](emotoai.com)

## Instructions
If you are coming across this first, please visit our [**hardware instructions here**](https://medium.com/@lucasochoa_63776/assembling-emoto-hardware-15c136276a11) to see how to get started with the physical fabrication. After 3D printing the chassis of emoto, you can load the software onto the raspberry pi. 

[*Software Only Instructions here, but they likely will make more sense after completing part of the hardware.*](https://medium.com/@gautambose/emoto-software-overview-and-instructions-162e4fdd0256)


## Directory Structure
|Directory| Purpose   |
|---|---|
|control.poser.app|expo app to run on a secondary device or simulator to control emoto body in real time|
|piServer|python code to run on the raspberry pi inside emoto base| 
|VideoEyes|VideoEyes app to display emoto eyes on the iphone placed on the robotic mount| 