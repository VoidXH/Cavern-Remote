using System.Diagnostics;

namespace CavernRemoteCGI.Commands {
    public abstract class Command {
        public abstract string Help { get; }

        public abstract void Run(string param);

        public static string GetHelp<T>() where T : Command, new() => new T().Help;

        protected static Process[] GetPlayer() {
            Process[] proc = Process.GetProcessesByName("mpc-hc64");
            if (proc.Length == 0)
                proc = Process.GetProcessesByName("mpc-hc");
            return proc;
        }
    }
}