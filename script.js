const player = document.querySelector(".player");
const video = document.querySelector("video");
const progressRange = document.querySelector(".progress-range");
const progressBar = document.querySelector(".progress-bar");
const playBtn = document.getElementById("play-btn");
const volumeIcon = document.getElementById("volume-icon");
const volumeRange = document.querySelector(".volume-range");
const volumeBar = document.querySelector(".volume-bar");
const currentTime = document.querySelector(".time-elapsed");
const duration = document.querySelector(".time-duration");
const fullscreenBtn = document.querySelector(".fullscreen");
const speed = document.querySelector(".player-speed");

// Play & Pause ----------------------------------- //
function showPlayIcon() {
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
}

function togglePlay() {
  if (video.paused) {
    video.play();
    playBtn.classList.replace("fa-play", "fa-pause");
    playBtn.setAttribute("title", "Pause");
  } else {
    video.pause();
    showPlayIcon();
  }
}

// On video end, show the play button icon
video.addEventListener("ended", showPlayIcon);

// Progress Bar ---------------------------------- //
// Calculate display time format
function displayTime(time) {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${minutes}:${seconds}`;
}

// Update progress bar as video plays
function updateProgress() {
  progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
  currentTime.textContent = `${displayTime(video.currentTime)} /`;
  duration.textContent = `${displayTime(video.duration)}`;
}

// Click to seek within the video
function setProgress(e) {
  const newTime = e.offsetX / progressRange.offsetWidth;
  progressBar.style.width = `${newTime * 100}%`;
  video.currentTime = newTime * video.duration;
}

// Volume Controls --------------------------- //
let lastVolume = 1;

function changeVolume(volume) {
  // Rounding volume up or down
  volume < 0.1 && (volume = 0);
  volume > 0.9 && (volume = 1);
  // Change Volume&Bar
  volumeBar.style.width = `${volume * 100}%`;
  video.volume = volume;
  // Change Icon volume
  volumeIcon.className = "";
  if (volume >= 0.7) {
    volumeIcon.classList.add("fa-solid", "fa-volume-up");
    volumeIcon.setAttribute("title", "Mute");
  } else if (volume < 0.7 && volume >= 0.1) {
    volumeIcon.classList.add("fa-solid", "fa-volume-down");
    volumeIcon.setAttribute("title", "Mute");
  } else if (volume < 0.1) {
    volumeIcon.classList.add("fa-solid", "fa-volume-off");
    volumeIcon.setAttribute("title", "");
  }
  lastVolume = video.volume;
}

// Volume Bar
function setVolume(e) {
  let volume = e.offsetX / volumeRange.offsetWidth;
  changeVolume(volume);
}

// Mute/Unmute
function toggleMute() {
  // If the volume was muted using the volume bar, do nothing!
  if (volumeIcon.getAttribute("class").includes("fa-volume-off")) return;

  // Toggle mute/unmute
  if (video.volume) {
    volumeBar.style.width = 0;
    video.volume = 0;
    volumeIcon.className = "";
    volumeIcon.classList.add("fa-solid", "fa-volume-mute");
    volumeIcon.setAttribute("title", "Unmute");
  } else {
    changeVolume(lastVolume);
    volumeIcon.setAttribute("title", "Mute");
  }
}

// Change Playback Speed -------------------- //
function changeSpeed() {
  video.playbackRate = speed.value;
}

// Fullscreen ------------------------------- /
let fullscreen = false;

// View in Fullscreen
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
  video.classList.add("video-fullscreen");
}

// Close Fullscreen
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
  video.classList.remove("video-fullscreen");
}

// Toggle Fullscreen
function toggleFullscreen() {
  !fullscreen ? openFullscreen(player) : closeFullscreen();
  fullscreen = !fullscreen;
}

// Event Listeners ------------------------------- /
playBtn.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);
video.addEventListener("timeupdate", updateProgress);
video.addEventListener("canplay", updateProgress);
progressRange.addEventListener("click", setProgress);
volumeRange.addEventListener("click", setVolume);
volumeIcon.addEventListener("click", toggleMute);
speed.addEventListener("change", changeSpeed);
fullscreenBtn.addEventListener("click", toggleFullscreen);
