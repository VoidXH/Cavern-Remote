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
    el.value = i;
    if (shader == i)
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
    el.value = i;
    if (preset == i)
      el.selected = "selected";
    select.appendChild(el);
  }
}

function loadControls(path) {
  if (get("state").innerHTML == "N/A") {
    location.reload();
    return;
  }
  loadCavern(path, 'controls');
  fillShaders();
  fillApos();
}