// Init SpeechSynth API
const synth = window.speechSynthesis;

// DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const rateReset = document.querySelector('#rateReset');
const pitchReset = document.querySelector('#pitchReset');
const body = document.querySelector('body');
const pause = document.querySelector('#pause');

// Init voices array
let voices = [];

const getVoices = () => {
	voices = synth.getVoices();

	// Loop thru voices and create option for each voice
	voices.forEach(voice => {
		// Create option element 
		const option = document.createElement('option');
		// Fill the optipn with the voice & language
		option.textContent = voice.name + '('+voice.lang+')';

		// Set needed option attributes 
		option.setAttribute('data-lang', voice.lang);
		option.setAttribute('data-name', voice.name);
		voiceSelect.appendChild(option);

	});
} 

getVoices();
if(synth.onvoiceschanged !== undefined){
	synth.onvoiceschanged = getVoices;
}  


// Speak
const speak = () => {
	// Check if speaking
	if(synth.speaking){
		console.error('Already speaking...')
		return;
	}

	if(textInput.value !== ''){
		body.style.background = '#141414 url(./img/wave.gif)';
		body.style.backgroundRepeat = 'repeat-x';
		body.style.backgroundSize = '100% 100%';

		// Get speak text 
		const speakText = new SpeechSynthesisUtterance(textInput.value);

		// Speak end
		speakText.onend = e => {
			console.log('Done speaking...');
			body.style.background = '#141414';
		}

		// Speak error
		speakText.onerror = e => {
			console.error('Something went wrong');
		}

		// Selected voice
		const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

		// Loop through voices
		voices.forEach(voice => {
			if(voice.name === selectedVoice){
				speakText.voice = voice;
			}
		});

		// Set pitch and rate
		speakText.rate = rate.value;
		speakText.pitch = pitch.value;

		// Speak
		synth.speak(speakText);
	}
}

// Event listeners
textForm.addEventListener('submit', e => {
	e.preventDefault();
	speak();
	textInput.blur();
});

// Rate value change 
rate.addEventListener('change', e => rateValue.textContent=rate.value);

// Pitch value change 
pitch.addEventListener('change', e => pitchValue.textContent=pitch.value);

// Rate reset
rateReset.addEventListener('click', e => {
	console.log(1);
	rateValue.textContent = 1;
	rate.value = 1;
});

// pitch reset
pitchReset.addEventListener('click', e => {
	console.log(1);
	pitchValue.textContent = 1;
	pitch.value = 1;
});




/* REDDIT API */
siteName = document.querySelector('#siteName');
submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', go);

function go(){
	let jsonURL = siteName.value;
	jsonURL += '.json';
	console.log(jsonURL);

	fetch(jsonURL).then(res => res.json()).then(data => {
		let title = (data[0].data.children[0].data.title);
		let body1 = data[1].data.children[0].data.body;
		let body2 = data[1].data.children[1].data.body;
		let body3 = data[1].data.children[2].data.body;
		let passage = title + '. Top Comments.\n\n' + body1 + '\n\nSecond comment:\n' + body2 + '\n\nThird comment:\n' + body3;
		console.log(passage);
		textInput.value = passage;
		speak();
	})
}