using System;
using System.Diagnostics;
using System.IO;
using System.Linq;

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
            files = files.OrderBy(x => rnd.Next()).ToArray();
            Process[] proc = GetPlayer();
            if (proc.Length != 0) {
                ProcessStartInfo info = proc[0].StartInfo;
                info.Arguments = "\"" + string.Join("\" \"", files) + '"';
                info.FileName = proc[0].GetMainModuleFileName();
                proc[0].StartInfo = info;
                proc[0].Start();
            } else
                Console.WriteLine("MPC-HC is not running.");
        }
    }
}