
'use strict';

const callButton = document.getElementById('callButton');
callButton.addEventListener('click', call);

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

const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
  };

let pc1;
let pc2;

function getName(pc) {
    return (pc === pc1) ? 'pc1' : 'pc2';
  }

  function getOtherPc(pc) {
    return (pc === pc1) ? pc2 : pc1;
  }
  

async function call(){    
    const configuration = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
    pc1 = new RTCPeerConnection(configuration);
    pc1.addEventListener('icecandidate', e => onIceCandidate(pc1, e));

    try {
        console.log('pc1 createOffer start');
        const offer = await pc1.createOffer(offerOptions);
        await onCreateOfferSuccess(offer);
      } catch (e) {
        onCreateSessionDescriptionError(e);
      }
}

async function onIceCandidate(pc, event) {
    try {
      await (getOtherPc(pc).addIceCandidate(event.candidate));
      onAddIceCandidateSuccess(pc);
    } catch (e) {
      onAddIceCandidateError(pc, e);
    }
    console.log(`${getName(pc)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
  }


async function onCreateOfferSuccess(desc) {
    console.log(`Offer from pc1\n${desc.sdp}`);
    console.log('pc1 setLocalDescription start');
    try {
      await pc1.setLocalDescription(desc);
      onSetLocalSuccess(pc1);
    } catch (e) {
      onSetSessionDescriptionError();
    }
  }

  function onCreateSessionDescriptionError(error) {
    console.log(`Failed to create session description: ${error.toString()}`);
  }
  function onAddIceCandidateError(pc, error) {
    console.log(`${getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
  }
  