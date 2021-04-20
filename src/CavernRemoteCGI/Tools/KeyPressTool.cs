using System;
using System.Runtime.InteropServices;

namespace CavernRemoteCGI.Tools {
    // See: https://docs.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes
    public enum Keys {
        Enter = 0x0D,
        Alt = 0x12,
        Esc = 0x1B,
        Left = 0x25,
        Up = 0x26,
        Right = 0x27,
        Down = 0x28
    }

    public class KeyPressTool {
        [DllImport("user32.dll")]
        static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        static extern bool PostMessage(IntPtr hWnd, uint Msg, int wParam, int lParam);

        const uint WM_KEYDOWN = 0x0100;
        const uint WM_KEYUP = 0x0101;
        const uint WM_SYSKEYDOWN = 0x0104;
        const uint WM_SYSKEYUP = 0x0105;

        public static void PressKey(Keys key) => PressKey(key, GetForegroundWindow());

        public static void PressKey(Keys key, IntPtr target) {
            PostMessage(target, WM_KEYDOWN, (int)key, 0);
            PostMessage(target, WM_KEYUP, (int)key, 0);
        }

        public static void PressSystemKey(Keys key) => PressSystemKey(key, GetForegroundWindow());

        public static void PressSystemKey(Keys key, IntPtr target) {
            PostMessage(target, WM_SYSKEYDOWN, (int)key, 0);
            PostMessage(target, WM_SYSKEYUP, (int)key, 0);
        }
    }
}