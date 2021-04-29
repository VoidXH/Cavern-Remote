using System;
using System.Diagnostics;

namespace CavernRemoteCGI.Commands {
    public abstract class Command {
        public abstract string Help { get; }

        public abstract void Run(string param);

        public static string GetHelp<T>() where T : Command, new() => new T().Help;

        public static void RunInput(string command) {
            string[] split = command.Split('=');
            if (split.Length == 1) {
                Console.WriteLine("Value not given.");
                return;
            }
            Command runner = null;
            switch (split[0]) {
                case "altmenu":
                    runner = new OpenMenuCommand();
                    break;
                case "apo":
                    runner = new ApplyAPOConfigCommand();
                    break;
                case "backup":
                    runner = new BackupAPOConfigCommand();
                    break;
                case "drelay":
                    runner = new DoubleRelayCommand();
                    break;
                case "key":
                    runner = new KeyPressCommand();
                    break;
                case "shuffle":
                    runner = new ShuffleFolderCommand();
                    break;
                case "test":
                    runner = new TestCommand();
                    break;
                case "var":
                    runner = new VariableCommand();
                    break;
                case "volume":
                    runner = new VolumeControlCommand();
                    break;
                default:
                    break;
            }
            if (runner != null)
                runner.Run(split[1]);
            else
                Console.WriteLine($"Unknown command: {split[0]}.");
        }

        protected static Process[] GetPlayer() {
            Process[] proc = Process.GetProcessesByName("mpc-hc64");
            if (proc.Length == 0)
                proc = Process.GetProcessesByName("mpc-hc");
            return proc;
        }
    }
}