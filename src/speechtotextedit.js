export default class SpeechToText {

  constructor(onAnythingSaid, onFinalised, onFinishedListening, language = 'en-US') {

    if (!('webkitSpeechRecognition' in window)) {
      throw new Error("This browser doesn't support speech recognition. Try Google Chrome.");
    }

    const WebkitSpeechRecognition = window.webkitSpeechRecognition;
    this.recognition = new WebkitSpeechRecognition();

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = language;

    let finalTranscript = '';


    this.recognition.onresult = (event) => {
      let interimTranscript = '';


      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcriptionPiece = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcriptionPiece;
          onFinalised(finalTranscript);
          finalTranscript = '';
        } else {
          interimTranscript += transcriptionPiece;
          onAnythingSaid(interimTranscript);
        }
      }
    };

    this.recognition.onend = () => {
      console.log('finished recording');
    }
  }



  startListening() {
    this.recognition.start();
  }
}
