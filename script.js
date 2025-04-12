const socket = io();
const statusText = document.getElementById('status');
let localStream;

async function startVoiceChat() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(localStream);
    const processor = audioContext.createScriptProcessor(2048, 1, 1);

    source.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = (e) => {
      const data = e.inputBuffer.getChannelData(0);
      socket.emit('voice', data.buffer);
    };

    socket.on('voice', (data) => {
      const floatArray = new Float32Array(data);
      const audioBuffer = audioContext.createBuffer(1, floatArray.length, audioContext.sampleRate);
      audioBuffer.copyToChannel(floatArray, 0);

      const playSource = audioContext.createBufferSource();
      playSource.buffer = audioBuffer;
      playSource.connect(audioContext.destination);
      playSource.start();
    });

    statusText.textContent = 'Connected';
  } catch (err) {
    console.error(err);
    statusText.textContent = 'Microphone error';
  }
}