hidden = [
  "$recycle.bin",
  "config.msi",
  "desktop.ini",
  "system volume information",
]

filterTypes = [ "all", "vid", "aud" ];

btn1 = "btn btn-primary";
btn0 = "btn btn-secondary";

function fixBrowser() {
  var table = get("files");
  for (var i = 0, row; row = table.rows[i]; ++i) {
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
        } else if (node.innerHTML.endsWith("_auto_file")) {
          var fmt = node.innerHTML.substr(0, node.innerHTML.length - 10);
          if (fmt === "lrc")
            node.innerHTML = "LyRiCs";
          else if (fmt === "srt")
            node.innerHTML = "SubRip";
          else
            node.innerHTML = fmt.toUpperCase() + " file";
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
  setupKeys();
}

selectedRow = 0;

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

function resetSearch() {
  get("search").value = "";
  updateSearch();
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
  pivot = high;
  i = low;
  for (var j = low; j <= high; ++j) {
    var a = rows[j].cells[col].childNodes[0].innerHTML;
    a = a ? a.toLowerCase() : "";
    var b = rows[pivot].cells[col].childNodes[0].innerHTML;
    b = b ? b.toLowerCase() : "";
    if (a < b) {
      swap(rows[i], rows[j]);
      ++i;
    }
  }
  swap(rows[i], rows[high]);
  return i
}

function quicksort(rows, low, high, col) {
  if (low < high) {
    p = partition(rows, low, high, col);
    quicksort(rows, low, p - 1, col);
    quicksort(rows, p + 1, high, col);
  }
}

function reverse(rows, from, to) {
  var end = (to - from) / 2;
  for (var i = 0; i < end; ++i)
    swap(rows[from + i], rows[to - i]);
}

lastName = true;
lastAsc = true;

function sort(name, asc) {
  get("nameup").className = name && asc ? btn1 : btn0;
  get("namedown").className = name && !asc ? btn1 : btn0;
  get("dateup").className = !name && asc ? btn1 : btn0;
  get("datedown").className = !name && !asc ? btn1 : btn0;
  var rows = get("files").rows;
  var folders;
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

videoFormats = [ "3gp", "3g2", "avi", "f4v", "flv", "m2ts", "mk3d", "mkv",
  "mp4", "mpeg", "mpg", "mov", "mp4", "mxf", "ogv", "ps", "ts", "webm", "wmv" ];
audioFormats = [ "aac", "aiff", "alac", "cda", "flac", "m4a", "mp3", "ogg",
  "opus", "wav", "wma", "weba" ];

function setType(type) {
  get("search").value = "";
  for (var i = 0; i < filterTypes.length; ++i)
    get(filterTypes[i]).className = filterTypes[i] == type ? btn1 : btn0;
  var table = get("files");
  if (type == "all") {
    for (var i = 1, row; row = table.rows[i]; ++i)
      if (row.style.display != "table-row")
        row.style.display = "table-row";
  } else {
    var target = type == "vid" ? videoFormats : audioFormats;
    for (var i = 1, row; row = table.rows[i]; ++i) {
      var next = target.includes(row.className) ? "table-row" : "none";
      if (row.style.display != next)
        row.style.display = next;
    }
  }
}