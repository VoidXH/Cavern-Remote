using System;
using System.IO;
using System.Reflection;

namespace CavernRemoteCGI.Commands {
    public class BackupAPOConfigCommand : Command {
        public override string Help => "backup=<name>: Save the current Equalizer APO configuration to the \"presets\" folder.";

        public override void Run(string name) {
            string fileName = name;
            if (!fileName.EndsWith(".txt"))
                fileName += ".txt";
            string dir = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location),
                apoSource = Path.Combine(dir, "apopath.txt");
            if (!File.Exists(apoSource)) {
                Console.WriteLine("The \"apopath.txt\" file doesn't exist in the same folder with this application. " +
                    "Please create it with Equalizer APO's install location written into it.");
                return;
            }
            string apoPath = File.ReadAllText(apoSource).Trim(),
                presetsPath = Path.Combine(dir, "presets");
            apoPath = Path.Combine(apoPath, "config.txt");
            if (File.Exists(apoPath))
                File.Copy(apoPath, Path.Combine(presetsPath, fileName), true);
            else
                Console.WriteLine("The Equalizer APO configuration file was not found. Please update \"apopath.txt\".");
        }
    }
}