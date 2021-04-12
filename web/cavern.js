function get(id) {
  return document.getElementById(id);
}

function postWith(id, target) {
  if (target != null)
    get(target).value = id;
  postForm(id, 'null', 0);
}

function selectShader() {
  var shader = parseInt(get("shaderPresets").value);
  get("shaderCommand").value = 4201 + shader;
  postForm(4201 + shader, 'null', 0);
  document.cookie = "shader=" + shader + ";";
}

function sendRequest(uri) {
  return fetch("Cavern.md?" + uri);
}

function selectApo() {
  var id = parseInt(get("apoPresets").value);
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
    nav = get("nav-" + div.id);
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
  var title = get("title");
  if (title)
    title.value = decodeURI(path);

  var param = new URLSearchParams(window.location.search).get("p");
  if (param == null)
    param = page;

  var menu = get("navmenu");
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
      setVisibility(get(page), param == page));
    window.onresize = function() {
      var page = controlPages[openPage];
      var maxOpen = Math.floor(window.innerWidth / get(page).clientWidth);
      if (maxOpen < 1)
        maxOpen = 1;
      var lastOpen = Math.min(openPage + maxOpen, controlPages.length);
      for (var i = 0; i < controlPages.length; ++i) {
        page = controlPages[(openPage + i) % controlPages.length];
        setVisibility(get(page), i < maxOpen);
      }
    }
    window.onresize();
  }

  var select = get("shaderPresets");
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
  
  select = get("apoPresets");
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
  var table = get("files");
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

function updateSearch() {
  var table = get("files");
  var string = get("search").value.toLowerCase();
  for (var i = 1, row; row = table.rows[i]; i++) {
    var entry = row.cells[0].childNodes[0].innerHTML.toLowerCase();
    var next = string.length == 0 || entry.includes(string) ? "table-row" : "none";
    if (row.style.display != next)
      row.style.display = next;
  }
}

function resetSearch() {
  get("search").value = "";
  updateSearch();
}