function postWith(id, target) {
  if (target != null)
    document.getElementById(target).value = id;
  postForm(id, 'null', 0);
}

function selectShader() {
  var shader = parseInt(document.getElementById("shaderPresets").value);
  document.getElementById("shaderCommand").value = 4201 + shader;
  postForm(4201 + shader, 'null', 0);
  document.cookie = "shader=" + shader + ";";
}

// Based on: https://github.com/chros73/madvr-js-remote
function sendRequest(uri) {
  var ajaxRequest;
  try {
    ajaxRequest = new XMLHttpRequest();
  } catch (e) {
    try {
      ajaxRequest = new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {
      try {
        ajaxRequest = new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {
        return false;
      }
    }
  }
  ajaxRequest.onreadystatechange = function() {
    if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200)
      clearTimeout(ajaxRequestTimeout);
  }
  ajaxRequest.open('GET', "Cavern.md?" + uri, true);
  ajaxRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  ajaxRequest.send();
  var ajaxRequestTimeout = setTimeout(ajaxTimeout, 2000);
  function ajaxTimeout() {
    ajaxRequest.abort();
  }
}

function selectApo() {
  var id = parseInt(document.getElementById("apoPresets").value);
  document.cookie = "apo=" + id + ";";
  sendRequest(encodeURIComponent(apoPresetNames[id]));
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function addMenuLink(menu, name, target, active) {
  var link = document.createElement("a");
  link.classList.add("nav-link");
  link.innerHTML = name;
  link.href = target;
  var elem = document.createElement("li");
  elem.id = "nav-" + name.toLowerCase();
  elem.classList.add("nav-item");
  if (active)
    elem.classList.add("active");
  elem.appendChild(link);
  menu.appendChild(elem);
}

function setVisibility(div, state) {
  if (div) {
    var next = state ? "block" : "none";
      if (div.style.display != next)
        div.style.display = next;
    nav = document.getElementById("nav-" + div.id);
    if (state)
      nav.classList.add("active");
    else
      nav.classList.remove("active");
  }
}

controlPages = [ "controls", "corrections", "dvd", "pro" ]

function loadCavern(path, page) {
  path = decodeURI(path);
  var slash = path.lastIndexOf('\\');
  var dot = path.lastIndexOf('.');
  if (slash != -1 && dot != -1)
    path = path.substring(slash + 1, dot);
  var title = document.getElementById("title");
  if (title)
    title.value = decodeURI(path);

  var param = new URLSearchParams(window.location.search).get("p");
  if (param == null)
    param = page;

  var menu = document.getElementById("navmenu");
  addMenuLink(menu, "Browser", "browser.html", param == "browser");
  addMenuLink(menu, "Controls", "controls.html", param == "controls");
  addMenuLink(menu, "Corrections", "controls.html?p=corrections", param == "corrections");
  addMenuLink(menu, "DVD", "controls.html?p=dvd", param == "dvd");
  addMenuLink(menu, "Pro", "controls.html?p=pro", param == "pro");
  //addMenuLink(menu, "Ambient lighting", "#", param == "lights");
  addMenuLink(menu, "About", "http://cavern.sbence.hu/", false);

  var openPage = controlPages.indexOf(param);
  if (openPage >= 0) {
    controlPages.forEach(page => 
      setVisibility(document.getElementById(page), param == page));
    window.onresize = function() {
      var page = controlPages[openPage];
      var maxOpen = Math.floor(window.innerWidth / document.getElementById(page).clientWidth);
      if (maxOpen < 1)
        maxOpen = 1;
      var lastOpen = Math.min(openPage + maxOpen, controlPages.length);
      for (var i = 0; i < controlPages.length; ++i) {
        page = controlPages[(openPage + i) % controlPages.length];
        setVisibility(document.getElementById(page), i < maxOpen);
      }
    }
    window.onresize();
  }

  var select = document.getElementById("shaderPresets");
  if (select) {
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
  
  select = document.getElementById("apoPresets");
  if (select) {
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
}

hidden = [
  "$recycle.bin",
  "desktop.ini",
  "system volume information",
]

function fixBrowser() {
  var table = document.getElementById("files");
  for (var i = 0, row; row = table.rows[i]; i++) {
    var entry = row.cells[0].childNodes[0].innerHTML;
    if (hidden.indexOf(entry.toLowerCase()) >= 0) {
      table.deleteRow(i);
      --i;
      continue;
    }
    for (var j = 0, col; col = row.cells[j]; j++) {
      var node = col.childNodes[0];
      if (node.innerHTML == null)
        continue;
      var l = node.innerHTML.length;
      if (l > 0) {
        if (node.innerHTML === "Ogg Vorbis") {
          node.innerHTML = "Xiph";
          continue;
        }
        var size = parseInt(node.innerHTML);
        if (!isNaN(size) && node.innerHTML.indexOf(".") == -1) {
          if (size < 1024)
            node.innerHTML = size + " kB";
          else if (size > 1048576)
            node.innerHTML = Math.round(size / 1048576 * 10) / 10 + " GB";
          else
            node.innerHTML = Math.round(size / 1024 * 10) / 10 + " MB";
        }
      }
    }  
  }
}