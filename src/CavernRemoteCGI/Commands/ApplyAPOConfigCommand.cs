using CavernRemoteCGI.Tools;
using System;
using System.IO;
using System.Reflection;

namespace CavernRemoteCGI.Commands {
    public class ApplyAPOConfigCommand : Command {
        const string lastKey = "lastapo";

        public override string Help => "apo=<filename>: Apply an Equalizer APO configuration file from the \"presets\" folder.";

        public override void Run(string fileName) {
            if (fileName == "?") {
                Settings settings = new Settings();
                if (settings.HasKey(lastKey))
                    Console.WriteLine(settings[lastKey]);
                else
                    Console.WriteLine("?");
                return;
            }

            if (!fileName.EndsWith(".txt"))
                fileName = fileName.ToLower() + ".txt";
            else
                fileName = fileName.ToLower();

            string dir = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location),
                apoPath = File.ReadAllText(Path.Combine(dir, "apopath.txt")).Trim(),
                presetsPath = Path.Combine(dir, "presets");
            apoPath = Path.Combine(apoPath, "config.txt");

            if (Directory.Exists(presetsPath)) {
                FileInfo[] configs = new DirectoryInfo(presetsPath).GetFiles();
                foreach (FileInfo file in configs) {
                    if (file.Name.ToLower().Equals(fileName)) {
                        File.Copy(file.FullName, apoPath, true);
                        Settings settings = new Settings();
                        settings.Set(lastKey, fileName.Substring(0, fileName.Length - 4));
                        settings.Save();
                        return;
                    }
                }
                Console.WriteLine("The supplied configuration file doesn't exist.");
            } else
                Console.WriteLine("The \"presets\" folder doesn't exist in the same folder with this application. Please create it.");
        }
    }
}