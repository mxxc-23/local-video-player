const fileInput = document.getElementById('fileInput');
const videoPlayer = document.getElementById('videoPlayer');
const volumeControl = document.getElementById('volume');
const playlist = document.getElementById('playlist');
const clearPlaylistBtn = document.getElementById('clearPlaylist');
let fileQueue = [];

fileInput.addEventListener('change', function(event) {
    fileQueue = Array.from(event.target.files);
    playlist.innerHTML = '';
    
    fileQueue.forEach((file, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = file.name;
        listItem.addEventListener('click', () => playVideo(index));
        playlist.appendChild(listItem);
    });

    if (fileQueue.length > 0) {
        playVideo(0);
    }
});

clearPlaylistBtn.addEventListener('click', function() {
    fileQueue = [];
    playlist.innerHTML = '';
    videoPlayer.src = "";
    videoPlayer.load();
});

// Function to play a video from the queue
function playVideo(index) {
    if (fileQueue[index]) {
        const objectURL = URL.createObjectURL(fileQueue[index]);
        videoPlayer.src = objectURL;
        videoPlayer.load();
        videoPlayer.play();
    }
}

// Volume control with gain boost
volumeControl.addEventListener('input', function(event) {
    videoPlayer.volume = Math.min(event.target.value, 1);
    const gainValue = event.target.value;

    if (!videoPlayer.audioContext) {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaElementSource(videoPlayer);
        const gainNode = audioContext.createGain();
        gainNode.gain.value = gainValue;
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        videoPlayer.audioContext = audioContext;
        videoPlayer.gainNode = gainNode;
    } else {
        videoPlayer.gainNode.gain.value = gainValue;
    }
});
