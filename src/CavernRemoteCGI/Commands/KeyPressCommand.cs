using CavernRemoteCGI.Tools;
using System;

namespace CavernRemoteCGI.Commands {
    public class KeyPressCommand : Command {
        public override string Help => "key=<key>: Simulates a key press on the keyboard.";

        public override void Run(string param) {
            param = param.ToLower();
            foreach (string target in Enum.GetNames(typeof(Keys)))
                if (param.Equals(target.ToLower()))
                    KeyPressTool.PressKey((Keys)Enum.Parse(typeof(Keys), target));
        }
    }
}