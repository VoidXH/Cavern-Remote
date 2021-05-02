using CavernRemoteCGI.Tools;
using System;

namespace CavernRemoteCGI.Commands {
    public class DoubleRelayCommand : Command {
        public override string Help => "drelay=<port>;<power>;<a>[;<b>];<on>;<astate>[;<bstate>]: Handle double relays.";

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
            int power, a, b = -1;
            bool on, astate, bstate = false;
            if (vars.Length == 5) {
                if (!int.TryParse(vars[1], out power) ||
                !int.TryParse(vars[2], out a)) {
                    Console.WriteLine("A pin was not a number.");
                    return;
                }
                if (!ParseBool(vars[3], out on) ||
                    !ParseBool(vars[4], out astate)) {
                    Console.WriteLine("A state was not boolean.");
                    return;
                }
            } else if (vars.Length == 7) {
                if (!int.TryParse(vars[1], out power) ||
                !int.TryParse(vars[2], out a) ||
                !int.TryParse(vars[3], out b)) {
                    Console.WriteLine("A pin was not a number.");
                    return;
                }
                if (!ParseBool(vars[4], out on) ||
                    !ParseBool(vars[5], out astate) ||
                    !ParseBool(vars[6], out bstate)) {
                    Console.WriteLine("A state was not boolean.");
                    return;
                }
            } else {
                Console.WriteLine("Incorrect number of parameters.");
                return;
            }

            Firmata board;
            try {
                board = new Firmata(vars[0]);
            } catch (UnauthorizedAccessException) {
                Console.WriteLine("Access is denied to the port.");
                return;
            } catch (ArgumentException) {
                Console.WriteLine("The port name does not begin with \"COM\", or the file type of the port is not supported.");
                return;
            } catch (InvalidOperationException) {
                Console.WriteLine("The specified port is used by another application.");
                return;
            } catch {
                Console.WriteLine("The port couldn't be opened.");
                return;
            }

            board.SetPin(a, !astate);
            if (b != -1)
                board.SetPin(b, !bstate);
            board.SetPin(power, on);
            board.Dispose();
        }
    }
}