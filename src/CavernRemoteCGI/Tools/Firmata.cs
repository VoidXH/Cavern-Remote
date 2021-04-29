using System;
using System.IO.Ports;

namespace CavernRemoteCGI.Tools {
    public enum PinMode {
        Input = 0,
        Output = 1,
        Analog = 2,
        PWM = 3,
        Servo = 4,
        I2C = 6,
        OneWire = 7,
        Stepper = 8,
        Encoder = 9,
        Serial = 10,
        Pullup = 11
    }

    public class Firmata : IDisposable {
        const int setPinMode = 0xF4;
        const int digitalWrite = 0xF5;

        readonly SerialPort port;

        public Firmata(string portName, int baudRate = 57600) {
            port = new SerialPort(portName, baudRate) {
                DataBits = 8,
                Parity = Parity.None,
                StopBits = StopBits.One
            };
            port.Open();
        }

        public void SetPin(int pin, PinMode mode) {
            byte[] message = new byte[] { setPinMode, (byte)pin, (byte)mode };
            port.Write(message, 0, message.Length);
        }

        public void SetPin(int pin, bool state) {
            byte[] message = new byte[] { digitalWrite, (byte)pin, state ? (byte)1 : (byte)0 };
            port.Write(message, 0, message.Length);
        }

        public void Dispose() {
            if (port != null)
                port.Close();
        }
    }
}