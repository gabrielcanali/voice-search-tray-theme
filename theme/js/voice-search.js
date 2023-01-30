// Verify if browser supports the Web Speech API and if page protocol is HTTPS

if ('webkitSpeechRecognition' in window && window.location.protocol === "https:") {

    // If the browser does not support SpeechRecognition, webkitSpeechRecognition is used.
    window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;

    // Define elements selectors
    let form = document.querySelector(".header .header-search-wrapper .input-search");
    let microphone = document.querySelector(".header .header-search-wrapper .button-voice");
    let micIcon = document.querySelector(".header .header-search-wrapper .button-voice > span");

    // Remove "imcompatible" class for microphon
    microphone.classList.remove('incompatible');
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-Br';

    // Defines a function that when speaking performs the search with the result of the speech
    function onSpeak(e) {
        
        micIcon.classList.remove('open');
        let search = e.results[0][0].transcript;
        form.value = search;
        form.parentNode.submit();
    }
    
    microphone.addEventListener('click', event => {

        micIcon.classList.add('open');
        recognition.start();
    });

    // Verify if user speak within the 7 second interval, if not close the microphone.
    let timeoutId;
    recognition.addEventListener('start', e => {

        timeoutId = setTimeout(function() {
            recognition.stop();
        }, 7000);
    });

    recognition.addEventListener('end', e => {

        clearTimeout(timeoutId);
        micIcon.classList.remove('open');
    });

    recognition.addEventListener('result', onSpeak);
} else {
    console.log('Browser Incompatible with Web Speech API');
}