adminFlex = [ "apoPresets", "menuNav", "osVol", "setup" ];
osMuted = false;
setFixVolume = cmd => sendCommand(cmd, "volume", vol = parseInt(get("vol").value));
timeStampBit = num => Math.floor(num).toString().padStart(2, '0');
getPlaybackPos = pos => timeStampBit(pos / 3600000) + ':' + timeStampBit(pos % 3600000 / 60000) + ':' + timeStampBit(pos % 60000 / 1000);
setOSMute = state => get("osMute").innerHTML = ((osMuted = state) ? "Muted" : "Unmuted") + (typeof(osVolPct) !== "undefined" ? ", " + osVolPct + '%' : '');

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

function updateTime() {
  if ((pos = startPos + new Date().getTime() - startTime) <= get("seek").max)
    get("time").innerHTML = getPlaybackPos(pos);
}

function seekTick() {
  var seek = get("seek"), val;
  get("pos").value = getPlaybackPos(seek.value = pos);
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
  sendRequest("var=lastshader;" + shader);
}

function selectApo() {
  var id = parseInt(get("apoPresets").value);
  document.cookie = "apo=" + id + ";";
  sendRequest("apo=" + encodeURIComponent(apoPresetNames[id]));
}

function fillSelect(control, cookieName, source) {
  var select = get(control), shader = getCookie(cookieName);
  for(var i = 0; i < source.length; ++i) {
    var el = document.createElement("option");
    el.textContent = source[i];
    if (shader == (el.value = i))
      el.selected = "selected";
    select.appendChild(el);
  }
}

function osVolume(command, gain) {
  if (typeof(osVolPct) !== "undefined")
    osVolPct = Math.max(0, Math.min(osVolPct + gain, 100));
  setOSMute(false);
  sendRequest("volume=" + command).then(data => {
    data.text().then(text => {
      osVolPct = parseInt(text.substr(text.lastIndexOf('\n', text.length - 2) + 1, text.indexOf('%')));
      setOSMute(false);
    });
  });
}

function loadControls(path, state, position, duration, volume, muted) {
  if (get("state").innerHTML == "N/A" && new URLSearchParams(window.location.search).get("na") == null)
    location.replace(window.location.href + (window.location.href.includes("?") ? '&' : '?') + "na=1");
  if (state == 2) { // TODO: handle [playbackrate]
    startTime = new Date().getTime();
    setInterval(updateTime, 500);
    seeker = setInterval(seekTick, 500);
  }
  get("vol").value = vol = volume;
  get("seek").max = duration;
  get("seek").value = startPos = position;
  if (muted)
    get("mute").innerHTML = "Mute";
  fillSelect("shaderPresets", "shader", shaderPresetNames);
  fillSelect("apoPresets", "apo", apoPresetNames);
  loadCavern(path, 'controls');
  sendRequest("apo=?").then(data => {
    data.text().then(text => {
      for (var i = 0; i < adminFlex.length; ++i) {
        get(adminFlex[i]).style.display = "flex";
        get(adminFlex[i] + 'X').style.display = "none";
      }
      var preset = text.substr(text.lastIndexOf('\n', text.length - 2) + 1).trim();
      for (var i = 0; i < apoPresetNames.length; ++i)
        if (apoPresetNames[i].toLowerCase() == preset)
          $('#apoPresets').val(i);
    });
  });
  sendRequest("volume=?").then(data => {
    data.text().then(text => {
      var split = text.substr(text.lastIndexOf('\n', text.length - 2) + 1).split(',');
      osVolPct = parseInt(split[1].trim().slice(0, -1));
      setOSMute(split[0] == "Muted");
    });
  });
  sendRequest("var=lastshader;?").then(data => {
    data.text().then(text => {
      var id = parseInt(text.substr(text.lastIndexOf('\n', text.length - 2) + 1).trim());
      if (!isNaN(id))
        $('#shaderPresets').val(id);
    });
  });
}