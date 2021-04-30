function setLights(vcc, r, g, b) {
  sendRequest("multiple" +
    "=drelay=" + firmataPort + ";" + relayGreenBlue + ";" + greenPin + ";" + bluePin + ";" + (g == 1 || b == 1 ? 1 : 0) + ";" + g + ";" + b +
    "=drelay=" + firmataPort + ";" + relayPowerRed + ";" + redPin + ";" + powerPin + ";" + (vcc == 0 || r == 1 ? 1 : 0) + ";" + r + ";" + (1 - vcc));
}