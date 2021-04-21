function loadHome() {
  var started = performance.now();
  sendRequest("test=1").then(data => {
    var pingValue = Math.round(performance.now() - started), ping = get("ping");
    data.text().then(text => {
      if (text.includes("Admin")) {
        var admin = get("admin");
        admin.innerHTML = "approved";
        admin.className = "text-success";
        get("admindesc").innerHTML = "all configured features will work";
      }
    });
    if (pingValue <= 150) {
      ping.innerHTML = pingValue + " ms (responsive)";
      ping.className = "text-success";
    } else if (pingValue <= 1000) {
      ping.innerHTML = pingValue + " ms (somewhat responsive)";
      ping.className = "text-warning";
    } else {
      ping.innerHTML = pingValue + " ms (network issues)";
      ping.className = "text-danger";
    }
  });
}