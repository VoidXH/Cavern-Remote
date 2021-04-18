function mute() {
  sendCommand(909).then(response => {
    var field = get("mute");
    field.innerHTML = field.innerHTML == "" ? "Mute" : "";
  });
}

function setVolume(command, gain) {
  get("vol").value = vol = Math.max(0, Math.min(vol + gain, 100));
  sendCommand(command);
}

setFixVolume = cmd => sendCommand(cmd, "volume", vol = parseInt(get("vol").value));
timeStampBit = num => Math.floor(num).toString().padStart(2, '0');
getPlaybackPos = pos => timeStampBit(pos / 3600000) + ':' + timeStampBit(pos % 3600000 / 60000) + ':' + timeStampBit(pos % 60000 / 1000);

function updateTime() {
  pos = startPos + new Date().getTime() - startTime;
  if (pos <= get("seek").max)
    get("time").innerHTML = getPlaybackPos(pos);
}

function seekTick() {
  var seek = get("seek"), val;
  seek.value = pos;
  get("pos").value = getPlaybackPos(pos);
  if (pos > parseInt(seek.max))
    location.reload();
}

function manualSeek() {
  if (typeof seeker !== "undefined")
    window.clearTimeout(seeker);
  get("pos").value = getPlaybackPos(get("seek").value);
}

function selectShader() {
  var shader = parseInt(get("shaderPresets").value);
  sendCommand(4201 + shader);
  document.cookie = "shader=" + shader + ";";
}

function selectApo() {
  var id = parseInt(get("apoPresets").value);
  document.cookie = "apo=" + id + ";";
  sendRequest(encodeURIComponent(apoPresetNames[id]));
}

function fillShaders() {
  var select = get("shaderPresets");
  var shader = getCookie("shader");
  for(var i = 0; i < shaderPresetNames.length; ++i) {
    var el = document.createElement("option");
    el.textContent = shaderPresetNames[i];
    if (shader == (el.value = i))
      el.selected = "selected";
    select.appendChild(el);
  }
}

function fillApos() {
  var select = get("apoPresets");
  var preset = getCookie("apo");
  for(var i = 0; i < apoPresetNames.length; ++i) {
    var el = document.createElement("option");
    el.textContent = apoPresetNames[i];
    if (preset == (el.value = i))
      el.selected = "selected";
    select.appendChild(el);
  }
}

function loadControls(path, state, position, duration, volume, muted) {
  if (get("state").innerHTML == "N/A")
    location.reload();
  if (state == 2) { // TODO: handle [playbackrate]
    startTime = new Date().getTime();
    setInterval(updateTime, 100);
    seeker = setInterval(seekTick, 100);
  }
  get("vol").value = vol = volume;
  get("seek").max = duration;
  get("seek").value = startPos = position;
  if (muted)
    get("mute").innerHTML = "Mute";
  loadCavern(path, 'controls');
  fillShaders();
  fillApos();
}