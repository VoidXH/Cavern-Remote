using System;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace CavernRemoteCGI.Tools {
    // Source: https://archive.codeplex.com/?p=inputsimulator
    public class ClickOnPointTool {
        [DllImport("user32.dll")]
        static extern bool ClientToScreen(IntPtr hWnd, ref Point lpPoint);

        [DllImport("user32.dll")]
        internal static extern uint SendInput(uint nInputs, [MarshalAs(UnmanagedType.LPArray), In] INPUT[] pInputs, int cbSize);

        internal struct INPUT {
            public uint Type;
            public MOUSEKEYBDHARDWAREINPUT Data;
        }

        [StructLayout(LayoutKind.Explicit)]
        internal struct MOUSEKEYBDHARDWAREINPUT {
            [FieldOffset(0)]
            public MOUSEINPUT Mouse;
        }

        internal struct MOUSEINPUT {
            public int X;
            public int Y;
            public uint MouseData;
            public uint Flags;
            public uint Time;
            public IntPtr ExtraInfo;

            public MOUSEINPUT(int x, int y) {
                X = x;
                Y = y;
                MouseData = 0;
                Flags = 0;
                Time = 0;
                ExtraInfo = IntPtr.Zero;
            }
        }

        public static void ClickOnPoint(IntPtr wndHandle, Point clientPoint) {
            var oldPos = Cursor.Position;
            ClientToScreen(wndHandle, ref clientPoint); // get screen coordinates
            Cursor.Position = new Point(clientPoint.X, clientPoint.Y); // set cursor on coords
            INPUT inputMouseDown = new INPUT { Type = 0 }; // input type: mouse
            inputMouseDown.Data.Mouse.Flags = 0x0002; // left button down
            INPUT inputMouseUp = new INPUT { Type = 0 };
            inputMouseUp.Data.Mouse.Flags = 0x0004; // left button up
            INPUT[] inputs = new INPUT[] { inputMouseDown, inputMouseUp };
            SendInput((uint)inputs.Length, inputs, Marshal.SizeOf(typeof(INPUT))); // press mouse
            Cursor.Position = oldPos; // return mouse
        }
    }
}