const videoHub = new signalR.HubConnectionBuilder().withUrl("/videoCallHub").build();

let peerConnection;
let localStream;

async function startCall() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById("localVideo").srcObject = localStream;

    peerConnection = createPeerConnection();

    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    videoHub.invoke("SendOffer", JSON.stringify(offer));
}

function createPeerConnection() {
    const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    const pc = new RTCPeerConnection(config);

    pc.onicecandidate = ({ candidate }) => {
        if (candidate) {
            videoHub.invoke("SendIceCandidate", JSON.stringify(candidate));
        }
    };

    pc.ontrack = (event) => {
        document.getElementById("remoteVideo").srcObject = event.streams[0];
    };

    return pc;
}

videoHub.on("ReceiveOffer", async (offer) => {
    peerConnection = createPeerConnection();

    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById("localVideo").srcObject = localStream;

    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    await peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    videoHub.invoke("SendAnswer", JSON.stringify(answer));
});

videoHub.on("ReceiveAnswer", async (answer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
});

videoHub.on("ReceiveIceCandidate", async (candidate) => {
    await peerConnection.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
});

videoHub.start().then(startCall);