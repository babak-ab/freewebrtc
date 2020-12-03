function hasUserMedia() {
    //check if the browser supports the WebRTC 
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia);
}

if (hasUserMedia()) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

    //enabling video and audio channels 
    navigator.getUserMedia({
        video: true,
        audio: true
    }, function (stream) {

        var video = document.querySelector('video');

        // Older browsers may not have srcObject
        if ("srcObject" in video) {
            video.srcObject = stream;
        } else {
            // Avoid using this in new browsers, as it is going away.
            video.src = window.URL.createObjectURL(stream);
        }

    }, function (err) {});
} else {
    alert("WebRTC is not supported");
}