using System;
using System.Globalization;
using System.IO;
using System.Reflection;

using CavernRemoteCGI.Tools;

namespace CavernRemoteCGI.Commands {
    /// <summary>
    /// Change configuration values in the Screen File shader of Cinema Shader Pack if they are present in MPC-HC's &qout;Shaders&qout; folder;
    /// </summary>
    public class ScreenFileCommand : Command {
        public override string Help => "screenfile=<param>:<change>: Change configuration values in the Screen File shader of Cinema Shader Pack.";

        public override void Run(string param) {
            string dir = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location),
                mpcPath = File.ReadAllText(Path.Combine(dir, "mpcpath.txt")).Trim();
            if (!Directory.Exists(mpcPath)) {
                Console.WriteLine("MPC-HC path is set up incorrectly in mpcpath.txt.");
                return;
            }

            string shaderPath = Path.Combine(mpcPath, "Shaders", "Screen File.hlsl");
            if (!File.Exists(shaderPath)) {
                Console.WriteLine("The Screen File shader of Cinema Shader Pack is not added to MPC-HC.");
                return;
            }

            string[] input = param.Split(':'); // [0] => parameter name, [1] => change in value
            if (input.Length != 2) {
                Console.WriteLine("Incorrect input format: " + param);
                return;
            }

            HLSLReconfig.Modify(shaderPath, input[0], float.Parse(input[1], CultureInfo.InvariantCulture));
        }
    }
}