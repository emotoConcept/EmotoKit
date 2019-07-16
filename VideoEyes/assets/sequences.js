
opening = {
	name: 'opening', sequence: [
		{anim: require('../assets/AdjustedOpening.mp4')},

	]
}

// TODO: intersperse random blinks
danceSequence = {
	name: 'danceSequence', sequence: [
		{anim: require('../assets/danceSequence.mp4')},
	]
}

recognitionSequence = {
	name: 'recognitionSequence', sequence: [
		{anim: require('../assets/recognitionSequence.mp4')},
	]
}

mirror = {
	name: 'mirror', sequence: [
		{anim: require('../assets/mirror.mp4')},

	]
}

lookingAround = {
	name: 'lookingAround', sequence: [
		{anim: require('../assets/lookingAround.mp4')},
	]
}

soundInput = {
	name: 'soundInput', sequence: [
		{anim: require('../assets/soundInput.mp4') },

		
	]
}

curiouslyLookingAround = {
	name: 'curiouslyLookingAround', sequence: [
		{anim: require('../assets/CuriouslyLookingAround.mp4')}
	]
}


sequences = [opening, soundInput, lookingAround, mirror, recognitionSequence, danceSequence, curiouslyLookingAround]


module.exports = {
	sequences
};