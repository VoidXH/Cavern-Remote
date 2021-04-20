using System.IO;
using System.Reflection;

namespace CavernRemoteCGI.Commands {
    public class ApplyAPOConfigCommand : Command {
        public override string Help => "apo=<filename>: Apply an Equalizer APO configuration file from the \"presets\" folder.";

        public override void Run(string param) {
            if (!param.EndsWith(".txt"))
                param += ".txt";

            string dir = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location),
                apoPath = File.ReadAllText(Path.Combine(dir, "apopath.txt")).Trim(),
                presetsPath = Path.Combine(dir, "presets");
            apoPath = Path.Combine(apoPath, "config.txt");

            if (Directory.Exists(presetsPath)) {
                FileInfo[] configs = new DirectoryInfo(presetsPath).GetFiles();
                foreach (FileInfo f in configs)
                    if (f.Name.ToLower().Equals(param))
                        File.Copy(f.FullName, apoPath, true);
            }
        }
    }
}