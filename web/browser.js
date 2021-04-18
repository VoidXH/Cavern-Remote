hidden = [ "$recycle.bin", "config.msi", "desktop.ini",
  "system volume information" ];
sizes = [ "kB", "MB", "GB", "TB", "PB", "EB", "YB" ];
filterTypes = [ "all", "vid", "aud" ];
videoFormats = [ "3gp", "3g2", "avi", "f4v", "flv", "m2ts", "mk3d", "mkv",
  "mp4", "mpeg", "mpg", "mov", "mp4", "mxf", "ogv", "ps", "ts", "webm", "wmv" ];
audioFormats = [ "aac", "aiff", "alac", "cda", "flac", "m4a", "mp3", "ogg",
  "opus", "wav", "wma", "weba" ];
btn1 = "btn btn-primary";
btn0 = "btn btn-secondary";
selectedRow = 0; // for navigation by keys
lastName = true; // for sorting
lastAsc = true;

function fixBrowser() {
  var table = get("files");
  for (var i = 0, row; row = table.rows[i]; ++i) {
    var entry = row.cells[0].childNodes[0].innerHTML;
    if (hidden.indexOf(entry.toLowerCase()) >= 0) {
      table.deleteRow(i--);
      continue;
    }
    var type = row.cells[1].childNodes[0];
    if (type.innerHTML === "Ogg Vorbis") {
      type.innerHTML = "Xiph";
    } else if (type.innerHTML != null && type.innerHTML.endsWith("_auto_file")) {
      var fmt = type.innerHTML.substr(0, type.innerHTML.length - 10);
      if (fmt === "lrc")
        type.innerHTML = "LyRiCs";
      else if (fmt === "srt")
        type.innerHTML = "SubRip";
      else
        type.innerHTML = fmt.toUpperCase() + " file";
    }
    var node = row.cells[2].childNodes[0], size = parseInt(node.innerHTML);
    if (!isNaN(size) && node.innerHTML.indexOf(".") == -1) {
      var log = Math.floor(Math.log(size) / Math.log(1024));
      node.innerHTML = Math.round(size / Math.pow(1024, log) * 10) / 10 + ' ' + sizes[log];
    }
  }
  setupKeys();
}

function setupKeys() {
  addEventListener('keydown', function(event) {
    const key = event.key;
    switch (event.key) {
      case "ArrowLeft":
        filterNav(-1)
        break;
      case "ArrowRight":
        filterNav(1)
        break;
      case "ArrowUp":
        navigate(-1);
        break;
      case "ArrowDown":
        navigate(1);
        break;
      case "Enter":
        window.open(get("files").rows[selectedRow].cells[0].childNodes[0].href, "_self");
        break;
    }
  });
}

function filterNav(dir) {
  for (var i = 0, filter; filter = filterTypes[i]; ++i) {
    if (get(filter).className == btn1) {
      var next = i + dir;
      if (next >= 0 && next < filterTypes.length)
        setType(filterTypes[next]);
      break;
    }
  }
}

function navigate(dir) {
  var table = get("files");
  for (var i = Math.max(selectedRow + dir, 0), row; row = table.rows[i]; i += dir) {
    if (row.style.display != "none") {
      table.rows[selectedRow].classList.remove("table-primary");
      selectedRow = i;
      row.classList.add("table-primary");
      break;
    }
  }
}

function updateSearch() {
  var field = get("search");
  if (get("all").className !== "btn btn-primary") {
    var oldVal = field.value;
    setType("all");
    field.value = oldVal;
  }
  var table = get("files");
  var string = field.value.toLowerCase();
  for (var i = 1, row; row = table.rows[i]; ++i) {
    var entry = row.cells[0].childNodes[0].innerHTML.toLowerCase();
    var next = string.length == 0 || entry.includes(string) ? "table-row" : "none";
    if (row.style.display != next)
      row.style.display = next;
  }
}

function swap(a, b) {
  var source = [];
  for (var i = 0; i < b.childNodes.length; ++i)
    source[i] = b.childNodes[i].innerHTML;
  for (var i = 0; i < b.childNodes.length; ++i)
    b.childNodes[i].innerHTML = a.childNodes[i].innerHTML;
  for (var i = 0; i < a.childNodes.length; ++i)
    a.childNodes[i].innerHTML = source[i];
}

function partition(rows, low, high, col) {
  var pivot = high, i = low;
  for (var j = low; j <= high; ++j) {
    var a = rows[j].cells[col].childNodes[0].innerHTML;
    a = a ? a.toLowerCase() : "";
    var b = rows[pivot].cells[col].childNodes[0].innerHTML;
    b = b ? b.toLowerCase() : "";
    if (a < b)
      swap(rows[i++], rows[j]);
  }
  swap(rows[i], rows[high]);
  return i
}

function quicksort(rows, low, high, col) {
  if (low < high) {
    var p = partition(rows, low, high, col);
    quicksort(rows, low, p - 1, col);
    quicksort(rows, p + 1, high, col);
  }
}

function reverse(rows, from, to) {
  for (var i = 0, end = (to - from) / 2; i < end; ++i)
    swap(rows[from + i], rows[to - i]);
}

function sort(name, asc) {
  get("nameup").className = name && asc ? btn1 : btn0;
  get("namedown").className = name && !asc ? btn1 : btn0;
  get("dateup").className = !name && asc ? btn1 : btn0;
  get("datedown").className = !name && !asc ? btn1 : btn0;
  var rows = get("files").rows, folders;
  for (folders = 1; folders < rows.length; ++folders)
    if (rows[folders].cells[0].className != "dirname")
      break;
  if (lastName != name) {
    var col = name ? 0 : 3;
    quicksort(rows, 1, folders - 1, col);
    quicksort(rows, folders, rows.length - 1, col);
  }
  if ((lastName == name && lastAsc != asc) || (lastName != name && !asc)) {
    reverse(rows, 1, folders - 1);
    reverse(rows, folders, rows.length - 1);
  }
  lastName = name;
  lastAsc = asc;
}

function setType(type) {
  get("search").value = "";
  for (var i = 0; i < filterTypes.length; ++i)
    get(filterTypes[i]).className = filterTypes[i] == type ? btn1 : btn0;
  var table = get("files");
  if (type == "all") {
    for (var i = 1, row; row = table.rows[i]; ++i)
      row.style.display = "table-row";
  } else {
    var target = type == "vid" ? videoFormats : audioFormats;
    for (var i = 1, row; row = table.rows[i]; ++i) {
      var next = target.includes(row.className) ? "table-row" : "none";
      row.style.display = next;
    }
  }
}