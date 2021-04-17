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

function setFixVolume(cmd) {
  sendCommand(cmd, "volume", vol = parseInt(get("vol").value));
}

function selectShader() {
  var shader = parseInt(get("shaderPresets").value);
  get("shaderCommand").value = 4201 + shader;
  postForm(4201 + shader, 'null', 0);
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

function loadControls(path, volume, muted) {
  if (get("state").innerHTML == "N/A") {
    location.reload();
    return;
  }
  get("vol").value = vol = volume;
  if (muted)
    get("mute").innerHTML = "Mute";
  loadCavern(path, 'controls');
  fillShaders();
  fillApos();
}