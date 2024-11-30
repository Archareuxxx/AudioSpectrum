
const canvas = document.getElementById("spectrum");
const ctx = canvas.getContext("2d");
const audio = document.getElementById("audio-player");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
//upload json
const jsonUpload = document.getElementById("json-upload");

jsonUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const loadedTemplate = JSON.parse(e.target.result);
    Object.assign(template, loadedTemplate); // Update template dynamically
  };

  reader.readAsText(file);
});

// Template Config (imported from JSON file)
const template = {
  type: "bars",
  colors: ["#ff0000", "#00ff00", "#0000ff"],
  barCount: 64,
  barWidth: 4,
  barSpacing: 2,
  radius: 100,
  animationSpeed: 1.5
};

// Audio API Setup
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audio);

source.connect(analyser);
analyser.connect(audioContext.destination);
analyser.fftSize = 256;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function drawBars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  analyser.getByteFrequencyData(dataArray);

  const barCount = template.barCount;
  const barWidth = template.barWidth;
  const barSpacing = template.barSpacing;
  const radius = template.radius;
  const colors = template.colors;

  for (let i = 0; i < barCount; i++) {
    const barHeight = dataArray[i] / 2;
    const x = i * (barWidth + barSpacing);

    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
  }

  requestAnimationFrame(drawBars);
}

audio.addEventListener("play", () => {
  audioContext.resume();
  drawBars();
});
