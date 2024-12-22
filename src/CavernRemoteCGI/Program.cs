using System;
using System.Net;

using CavernRemoteCGI.Commands;

namespace CavernRemoteCGI {
    class Program {
        static void Main(string[] args) {
            string query = Environment.GetEnvironmentVariable("QUERY_STRING");
            string command = string.Empty;
            if (query != null) {
                command = WebUtility.UrlDecode(query).ToLower();
            } else if (args.Length != 0) {
                command = args[0];
            }

            if (command.Contains("=")) {
                Command.RunInput(command);
            } else {
                CommandList.Print();
            }
        }
    }
}