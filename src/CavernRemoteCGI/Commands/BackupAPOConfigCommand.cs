using System.IO;
using System.Reflection;

namespace CavernRemoteCGI.Commands {
    public class BackupAPOConfigCommand : Command {
        public override string Help => "backup=<name>: Save the current Equalizer APO configuration to the \"presets\" folder.";

        public override void Run(string param) {
            string fileName = param;
            if (!fileName.EndsWith(".txt"))
                fileName += ".txt";
            string dir = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location),
                apoPath = File.ReadAllText(Path.Combine(dir, "apopath.txt")).Trim(),
                presetsPath = Path.Combine(dir, "presets");
            apoPath = Path.Combine(apoPath, "config.txt");
            File.Copy(apoPath, Path.Combine(presetsPath, fileName), true);
        }
    }
}