using CavernRemoteCGI.Tools;
using System;

namespace CavernRemoteCGI.Commands {
    public class KeyPressCommand : Command {
        public override string Help => "key=<key>: Simulates a key press on the keyboard.";

        public override void Run(string key) {
            key = key.ToLower();
            foreach (string target in Enum.GetNames(typeof(Keys))) {
                if (key.Equals(target.ToLower())) {
                    KeyPressTool.PressKey((Keys)Enum.Parse(typeof(Keys), target));
                    return;
                }
            }
            Console.Write("The supplied key is not supported or isn't a valid key. The supported keys are: ");
            Console.WriteLine(string.Join(", ", Enum.GetNames(typeof(Keys))));
        }
    }
}