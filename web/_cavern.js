apoPresetNames = [
  "Manual",
  "Flat"
]

shaderPresetNames = [
  "2D",
  "SBS 3D",
  "3D -> 2D",
  "HDR to SDR (250 nit)",
  "HDR to SDR (50 nit)",
  "HDR to SDR (legacy)"
]

firmataPort = "COM7"; // Ambient lighting control hardware serial port, Cavern Remote supports Firmata
relayPowerRed = 24; // +12 V and red ground double relay enable pin
relayGreenBlue = 25; // Green and blue ground double relay enable pin
powerPin = 33; // +12 V enable pin (active low!)
redPin = 35; // Red ground enable pin
greenPin = 37; // Green ground enable pin
bluePin = 39; // Blue ground enable pin