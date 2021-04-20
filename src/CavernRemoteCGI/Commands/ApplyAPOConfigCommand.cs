using System;
using System.IO;
using System.Reflection;

namespace CavernRemoteCGI.Commands {
    public class ApplyAPOConfigCommand : Command {
        public override string Help => "apo=<filename>: Apply an Equalizer APO configuration file from the \"presets\" folder.";

        public override void Run(string fileName) {
            if (!fileName.EndsWith(".txt"))
                fileName += ".txt";

            string dir = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location),
                apoPath = File.ReadAllText(Path.Combine(dir, "apopath.txt")).Trim(),
                presetsPath = Path.Combine(dir, "presets");
            apoPath = Path.Combine(apoPath, "config.txt");

            if (Directory.Exists(presetsPath)) {
                FileInfo[] configs = new DirectoryInfo(presetsPath).GetFiles();
                foreach (FileInfo f in configs) {
                    if (f.Name.ToLower().Equals(fileName)) {
                        File.Copy(f.FullName, apoPath, true);
                        return;
                    }
                }
                Console.WriteLine("The supplied configuration file doesn't exist.");
            } else
                Console.WriteLine("The \"presets\" folder doesn't exist in the same folder with this application. Please create it.");
        }
    }
}