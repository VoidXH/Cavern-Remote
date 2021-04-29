using CavernRemoteCGI.Commands;
using System;
using System.Net;

namespace CavernRemoteCGI {
    class Program {
        static void PrintHelp<T>() where T: Command, new() {
            Console.Write("\t");
            Console.WriteLine(Command.GetHelp<T>());
        }

        static void Main(string[] args) {
            string query = Environment.GetEnvironmentVariable("QUERY_STRING");
            string command = string.Empty;
            if (query != null)
                command = WebUtility.UrlDecode(query).ToLower();
            else if (args.Length != 0)
                command = args[0];
            if (command.Contains("="))
                Command.RunInput(command);
            else {
                Console.WriteLine("Available commands for the Cavern Remote CGI Handler:");
                PrintHelp<OpenMenuCommand>();
                PrintHelp<ApplyAPOConfigCommand>();
                PrintHelp<BackupAPOConfigCommand>();
                PrintHelp<DoubleRelayCommand>();
                PrintHelp<KeyPressCommand>();
                PrintHelp<ShuffleFolderCommand>();
                PrintHelp<TestCommand>();
                PrintHelp<VariableCommand>();
                PrintHelp<VolumeControlCommand>();
            }
        }
    }
}