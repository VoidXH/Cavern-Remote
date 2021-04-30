using System;

namespace CavernRemoteCGI.Commands {
    public class MultipleCommand : Command {
        public override string Help => "multiple=<commands>: Run multiple commands separated by \"=\".";

        public override void Run(string param) {
            while (true) {
                int first = param.IndexOf('='), second = param.IndexOf('=', first + 1);
                if (first == -1) {
                    Console.WriteLine("Invalid last command.");
                    return;
                }
                if (second != -1)
                    RunInput(param.Substring(0, second));
                else {
                    RunInput(param);
                    break;
                }
                param = param.Substring(second + 1);
            }
        }
    }
}