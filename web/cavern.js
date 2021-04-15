function get(id) {
  return document.getElementById(id);
}

function postWith(id, target) {
  if (target != null)
    get(target).value = id;
  postForm(id, 'null', 0);
}

function sendRequest(uri) {
  return fetch("Cavern.md?" + uri);
}

function sendCommand(id, extraName = "null", extraValue = 0) {
  var data = new FormData();
  data.append('wm_command', id);
  data.append(extraName, extraValue);
  fetch("/command.html", {
    method: "POST",
    body: new URLSearchParams(data)
  });
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ')
      c = c.substring(1);
    if (c.indexOf(name) == 0)
      return c.substring(name.length, c.length);
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
}