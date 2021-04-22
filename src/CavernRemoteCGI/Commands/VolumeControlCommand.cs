using CavernRemoteCGI.CoreAudio;
using System;
using System.Runtime.InteropServices;

namespace CavernRemoteCGI.Commands {
    public class VolumeControlCommand : Command {
        public override string Help => "volume=<up/done/mute/unmute>: Control Windows volume.";

        [DllImport("user32.dll")]
        static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        static extern IntPtr SendMessage(IntPtr hWnd, int Msg, IntPtr wParam, IntPtr lParam);

        const int WM_APPCOMMAND = 0x319;

        const int APPCOMMAND_VOLUME_DOWN = 0x90000;
        const int APPCOMMAND_VOLUME_UP = 0xA0000;

        public override void Run(string param) {
            switch (param) {
                case "up":
                    SendMessage(GetForegroundWindow(), WM_APPCOMMAND, IntPtr.Zero, (IntPtr)APPCOMMAND_VOLUME_UP);
                    break;
                case "down":
                    SendMessage(GetForegroundWindow(), WM_APPCOMMAND, IntPtr.Zero, (IntPtr)APPCOMMAND_VOLUME_DOWN);
                    break;
                case "mute":
                    AudioManager.SetMasterVolumeMute(true);
                    break;
                case "unmute":
                    AudioManager.SetMasterVolumeMute(false);
                    break;
                case "?":
                    if (AudioManager.GetMasterVolumeMute())
                        Console.Write("Muted,");
                    else
                        Console.Write("Unmuted,");
                    Console.WriteLine($" {AudioManager.GetMasterVolume()}%");
                    break;
                default:
                    Console.WriteLine("Invalid command.");
                    break;
            }
        }
    }
}