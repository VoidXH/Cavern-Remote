using System;

namespace CavernRemoteCGI.Commands {
    public static class CommandList {
        static void PrintHelp<T>() where T : Command, new() {
            Console.Write("\t");
            Console.WriteLine(Command.GetHelp<T>());
        }

        public static void Print() {
            Console.WriteLine("Available commands for the Cavern Remote CGI Handler:");
            PrintHelp<OpenMenuCommand>();
            PrintHelp<ApplyAPOConfigCommand>();
            PrintHelp<BackupAPOConfigCommand>();
            PrintHelp<DoubleRelayCommand>();
            PrintHelp<KeyPressCommand>();
            PrintHelp<MultipleCommand>();
            PrintHelp<ShuffleFolderCommand>();
            PrintHelp<TestCommand>();
            PrintHelp<VariableCommand>();
            PrintHelp<VolumeControlCommand>();
        }
    }
}