controlPages = [ "controls", "correction", "projection", "menus", "pro" ]
get = id => document.getElementById(id);
sendRequest = uri => fetch("Cavern.md?" + uri);

function sendCommand(id, extraName = "null", extraValue = 0, reload = false) {
  var data = new FormData();
  data.append('wm_command', id);
  data.append(extraName, extraValue);
  var cmd = fetch("/command.html", { method: "POST", body: new URLSearchParams(data) });
  if (reload)
    setTimeout(function() { location.reload(); }, 333);
  return cmd;
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; ++i) {
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
    if (state) {
      nav.classList.add("active");
      if (div.innerHTML == "") {
        lazyLoad(div);
      }
    } else
      nav.classList.remove("active");
  }
}

function lazyLoad(div) {
  if (div.getAttribute("fetched") === null) {
    fetch(`lazy${div.id}.htm`).then(response => response.text()).then(content => {
      div.innerHTML = content;
      div.setAttribute("fetched", "true");

      const scripts = div.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent;
        document.body.appendChild(newScript).parentNode.removeChild(newScript);
      });
    }).catch(e => div.innerHTML = "Error fetching controls: " + e);
  }
}

function loadIfAdmin(id) {
  sendRequest("test=?").then(data => {
    data.text().then(text => {
      if (text.endsWith("Admin\r\n")) {
        fetch(`lazy${id}x.htm`).then(response => response.text()).then(content => {
          $('#'+id).html(content);
        });
      }
    });
  });
}

function loadCavern(path, page) {
  path = decodeURIComponent(path);
  var slash = path.lastIndexOf('\\'), dot = path.lastIndexOf('.'), title = get("title"), param = new URLSearchParams(window.location.search).get("p");
  if (slash != -1 && dot != -1)
    path = path.substring(slash + 1, dot);
  if (title)
    title.value = path;
  if (param == null)
    param = page;

  var menu = get("navmenu");
  addMenuLink(menu, "Browser", "browser.html", param == "browser");
  addMenuLink(menu, "Controls", "controls.html", param == "controls");
  addMenuLink(menu, "Correction", "controls.html?p=correction", param == "correction");
  addMenuLink(menu, "Projection", "controls.html?p=projection", param == "projection");
  addMenuLink(menu, "Menus", "controls.html?p=menus", param == "menus");
  addMenuLink(menu, "Pro", "controls.html?p=pro", param == "pro");
  addMenuLink(menu, "Lights", "lights.html", param == "lights");
  addMenuLink(menu, "Help", "http://cavern.sbence.hu/cavern/doc.php?p=Remote", false);
  addMenuLink(menu, "About", "http://cavern.sbence.hu/", false);

  var openPage = controlPages.indexOf(param);
  if (openPage >= 0) {
    controlPages.forEach(page => 
      setVisibility(get(page), param == page));
    window.onresize = function() {
      var page = controlPages[openPage], maxOpen = Math.max(1, Math.floor(window.innerWidth / get(page).clientWidth)), lastOpen = Math.min(openPage + maxOpen, controlPages.length);
      for (var i = 0; i < controlPages.length; ++i) {
        page = controlPages[(openPage + i) % controlPages.length];
        setVisibility(get(page), i < maxOpen);
      }
    }
    window.onresize();
  }
}
