using CavernRemoteCGI.Tools;
using System;

namespace CavernRemoteCGI.Commands {
    public class VariableCommand : Command {
        public override string Help => "var=<variable>;<value or ?>: Set or get a Cavern Remote variable. Use this for setting storage.";

        public override void Run(string param) {
            int index = param.IndexOf(';');
            if (index < 0) {
                Console.WriteLine("There was no ; to separate the variable from the value or query.");
                return;
            }

            string var = param.Substring(0, index), value = param.Substring(index + 1);
            Settings settings = new Settings();
            if (value.Equals("?")) {
                if (settings.HasKey(var))
                    Console.WriteLine(settings[var]);
                else
                    Console.WriteLine("The queried variable doesn't exist.");
            } else {
                settings.Set(var, value);
                settings.Save();
            }
        }
    }
}