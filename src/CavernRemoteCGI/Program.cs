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
            if (command.Contains("=")) {
                string[] split = command.Split('=');
                if (split.Length == 1) {
                    Console.WriteLine("Value not given.");
                    return;
                }
                Command runner = null;
                switch (split[0]) {
                    case "apo":
                        runner = new ApplyAPOConfigCommand();
                        break;
                    case "backup":
                        runner = new BackupAPOConfigCommand();
                        break;
                    case "key":
                        runner = new KeyPressCommand();
                        break;
                    case "altmenu":
                        runner = new OpenMenuCommand();
                        break;
                    default:
                        break;
                }
                if (runner != null)
                    runner.Run(split[1]);
                else
                    Console.WriteLine($"Unknown command: {split[0]}.");
            } else {
                Console.WriteLine("Available commands for the Cavern Remote CGI Handler:");
                PrintHelp<OpenMenuCommand>();
                PrintHelp<ApplyAPOConfigCommand>();
                PrintHelp<BackupAPOConfigCommand>();
                PrintHelp<KeyPressCommand>();
            }
        }
    }
}