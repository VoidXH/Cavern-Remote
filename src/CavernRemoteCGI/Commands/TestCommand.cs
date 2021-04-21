using System;
using System.Security.Principal;

namespace CavernRemoteCGI.Commands {
    public class TestCommand : Command {
        public override string Help => "test=<anything>: Test application privileges.";

        public override void Run(string param) {
            using (WindowsIdentity identity = WindowsIdentity.GetCurrent()) {
                WindowsPrincipal principal = new WindowsPrincipal(identity);
                if (principal.IsInRole(WindowsBuiltInRole.Administrator))
                    Console.WriteLine("Admin");
                else
                    Console.WriteLine("User");
            }
        }
    }
}