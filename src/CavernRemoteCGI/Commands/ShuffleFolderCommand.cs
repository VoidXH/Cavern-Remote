using System;
using System.Diagnostics;
using System.IO;
using System.Threading;

namespace CavernRemoteCGI.Commands {
    public class ShuffleFolderCommand : Command {
        public override string Help => "shuffle=<folder>: Play all media files in a folder in random order.";

        public override void Run(string path) {
            if (!Directory.Exists(path)) {
                Console.WriteLine("The supplied directory doesn't exist.");
                return;
            }
            string[] files = Directory.GetFiles(path);
            Random rnd = new Random();
            rnd.Shuffle(files);
            Process[] proc = GetPlayer();
            if (proc.Length != 0) {
                ProcessStartInfo info = proc[0].StartInfo;
                info.FileName = proc[0].GetMainModuleFileName();
                info.Arguments = "\"" + string.Join("\" \"", files) + '"';
                bool safeWay = info.FileName.Length + info.Arguments.Length > 2048;

                string playlistName = Path.Combine(path, path.GetHashCode().ToString() + ".m3u");
                if (safeWay) {
                    File.WriteAllLines(playlistName, files);
                    info.Arguments = $"\"{playlistName}\"";
                }

                proc[0].StartInfo = info;
                proc[0].Start();

                if (safeWay) {
                    Thread.Sleep(500);
                    File.Delete(playlistName);
                }
            } else
                Console.WriteLine("MPC-HC is not running.");
        }
    }
}