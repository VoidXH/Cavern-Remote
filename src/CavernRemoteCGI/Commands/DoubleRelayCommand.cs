using CavernRemoteCGI.Tools;
using System;

namespace CavernRemoteCGI.Commands {
    public class DoubleRelayCommand : Command {
        public override string Help => "drelay=<port>;<power>;<a>;<b>;<on>;<astate>;<bstate>: Handle double relays.";

        static bool ParseBool(string text, out bool result) {
            if (bool.TryParse(text, out result))
                return true;
            if (int.TryParse(text, out int num)) {
                result = num != 0;
                return true;
            }
            return false;
        }

        public override void Run(string param) {
            string[] vars = param.Split(';');
            if (vars.Length != 7) {
                Console.WriteLine("Incorrect number of parameters.");
                return;
            }
            if (!int.TryParse(vars[1], out int power) ||
                !int.TryParse(vars[2], out int a) ||
                !int.TryParse(vars[3], out int b)) {
                Console.WriteLine("A pin was not a number.");
                return;
            }
            if (!ParseBool(vars[4], out bool on) ||
                !ParseBool(vars[5], out bool astate) ||
                !ParseBool(vars[6], out bool bstate)) {
                Console.WriteLine("A state was not boolean.");
                return;
            }

            Firmata board;
            try {
                board = new Firmata(vars[0]);
            } catch (UnauthorizedAccessException _) {
                Console.WriteLine("Access is denied to the port.");
                return;
            } catch (ArgumentException _) {
                Console.WriteLine("The port name does not begin with \"COM\", or the file type of the port is not supported.");
                return;
            } catch (InvalidOperationException _) {
                Console.WriteLine("The specified port is used by another application.");
                return;
            } catch {
                Console.WriteLine("The port couldn't be opened.");
                return;
            }

            board.SetPin(a, !astate);
            board.SetPin(b, !bstate);
            board.SetPin(power, on);
            board.Dispose();
        }
    }
}