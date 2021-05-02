Vcc = 0, R = 0, G = 0, B = 0
setGB = _ => "drelay=" + firmataPort + ";" + relayGreenBlue + ";" + greenPin + ";" + bluePin + ";" + (G == 1 || B == 1 ? 1 : 0) + ";" + G + ";" + B;
setVccR = _ => "drelay=" + firmataPort + ";" + relayPowerRed + ";" + redPin + ";" + powerPin + ";" + (Vcc == 0 || R == 1 ? 1 : 0) + ";" + R + ";" + (1 - Vcc);

function setLights(vcc, r, g, b) {
  Vcc = vcc, R = r, G = g, B = b;
  sendRequest("multiple=" + setGB() + "=" + setVccR());
}