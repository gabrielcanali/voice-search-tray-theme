// Verify if browser supports the Web Speech API and if page protocol is HTTPS
if ('webkitSpeechRecognition' in window && window.location.protocol === "https:") {

    // If the browser does not support SpeechRecognition, webkitSpeechRecognition is used.
    window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;

    // Define elements selectors
    let form = document.querySelector(".header .header-search-wrapper .input-search");
    let microphone = document.querySelector(".header .header-search-wrapper .button-voice");
    let microphoneIcon = document.querySelector(".header .header-search-wrapper .button-voice > span");

    // Remove "incompatible" class for microphon
    microphone.classList.remove('incompatible');
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-Br';

    // Defines a function that when speaking performs the search with the result of the speech
    recognition.addEventListener('result', e => {
        microphoneIcon.classList.remove('open');
        let search = e.results[0][0].transcript;
        form.value = search;
        form.parentNode.submit();
    });
    
    // Defines a function that when you click on the microphone it opens
    microphone.addEventListener('click', () => {
        microphoneIcon.classList.add('open');
        recognition.start();
        // Verify if user speak within the 6 second interval, if not close the microphone.
        setTimeout(() => {
            recognition.stop();
            microphoneIcon.classList.remove('open');
        }, 6000);
    });

} else {
    console.log('Browser Incompatible with Web Speech API');
}