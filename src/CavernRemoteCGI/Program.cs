using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Threading;

namespace CavernRemoteCGI {
    class Program {
        // See: https://docs.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes
        enum Keys {
            Enter = 0x0D,
            Alt = 0x12,
            Esc = 0x1B,
            Left = 0x25,
            Up = 0x26,
            Right = 0x27,
            Down = 0x28
        }

        [DllImport("user32.dll")]
        static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        static extern bool PostMessage(IntPtr hWnd, uint Msg, int wParam, int lParam);

        const uint WM_KEYDOWN = 0x0100;
        const uint WM_KEYUP = 0x0101;
        const uint WM_SYSKEYDOWN = 0x0104;
        const uint WM_SYSKEYUP = 0x0105;

        static void ApplyAPOConfig(string fileName) {
            string dir = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location),
                apoPath = File.ReadAllText(Path.Combine(dir, "apopath.txt")).Trim(),
                presetsPath = Path.Combine(dir, "presets");
            apoPath = Path.Combine(apoPath, "config.txt");

            if (Directory.Exists(presetsPath)) {
                FileInfo[] configs = new DirectoryInfo(presetsPath).GetFiles();
                foreach (FileInfo f in configs)
                    if (f.Name.ToLower().Equals(fileName))
                        File.Copy(f.FullName, apoPath, true);
            }
        }

        static void BackupAPOConfig(string fileName) {
            if (!fileName.EndsWith(".txt"))
                fileName += ".txt";
            string dir = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location),
                apoPath = File.ReadAllText(Path.Combine(dir, "apopath.txt")).Trim(),
                presetsPath = Path.Combine(dir, "presets");
            apoPath = Path.Combine(apoPath, "config.txt");
            File.Copy(apoPath, Path.Combine(presetsPath, fileName), true);
        }

        static Process[] GetPlayer() {
            Process[] proc = Process.GetProcessesByName("mpc-hc64");
            if (proc.Length == 0)
                proc = Process.GetProcessesByName("mpc-hc");
            return proc;
        }

        static void KeyCommand(string key) {
            foreach (string target in Enum.GetNames(typeof(Keys))) {
                if (key.Equals(target.ToLower())) {
                    int keyId = (int)Enum.Parse(typeof(Keys), target);
                    PostMessage(GetForegroundWindow(), WM_KEYDOWN, keyId, 0);
                    PostMessage(GetForegroundWindow(), WM_KEYUP, keyId, 0);
                    break;
                }
            }
        }

        static void ClickCommand(string position) {
            Process[] proc = GetPlayer();
            if (proc.Length != 0) {
                string[] pos = position.Split('x');
                if (pos.Length > 1 && int.TryParse(pos[0], out int x) && int.TryParse(pos[1], out int y)) {
                    PostMessage(proc[0].MainWindowHandle, WM_SYSKEYDOWN, (int)Keys.Alt, 0);
                    PostMessage(proc[0].MainWindowHandle, WM_SYSKEYUP, (int)Keys.Alt, 0);
                    Thread.Sleep(100);
                    ClickOnPointTool.ClickOnPoint(proc[0].MainWindowHandle, new Point(x, y));
                }
            }
        }

        static void Main(string[] _) {
            string command = WebUtility.UrlDecode(Environment.GetEnvironmentVariable("QUERY_STRING")).ToLower();
            if (command.Contains("=")) {
                string[] split = command.Split('=');
                if (split.Length == 1) {
                    Console.WriteLine("Value not given.");
                    return;
                }
                switch (split[0]) {
                    case "backup":
                        BackupAPOConfig(split[1]);
                        break;
                    case "key":
                        KeyCommand(split[1].ToLower());
                        break;
                    case "click":
                        ClickCommand(split[1].ToLower());
                        break;
                    default:
                        Console.WriteLine($"Unknown command: {split[0]}.");
                        break;
                }
            } else {
                if (!command.EndsWith(".txt"))
                    ApplyAPOConfig(command + ".txt");
                else
                    ApplyAPOConfig(command);
            }
        }
    }
}