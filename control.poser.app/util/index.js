const range_map = (value, leftMin, leftMax, rightMin, rightMax) => {
    const leftSpan = leftMax - leftMin; 
    const rightSpan = rightMax - rightMin; 

    const valueScaled = (value - leftMin) / leftSpan;

    return rightMin + (valueScaled * rightSpan)

}

module.exports = {
    range_map
}; 