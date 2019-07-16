# Gautam Bose
# Util functions for EmotoKIt
# Apr 2019


def range_map(leftMin, leftMax, rightMin, rightMax, value):
    leftSpan = leftMax - leftMin
    rightSpan = rightMax - rightMin

    valueScaled = float(value - leftMin) / float(leftSpan)

    return int(rightMin + (valueScaled * rightSpan))

def channel_map(channel):
    if (channel == 0): return 0x08
    elif (channel == 1): return 0x0C
    elif (channel == 2): return 0x10
    else: return None
