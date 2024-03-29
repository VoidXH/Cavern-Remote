﻿using CavernRemoteCGI.Tools;
using System;
using System.Diagnostics;
using System.Drawing;
using System.Threading;

namespace CavernRemoteCGI.Commands {
    public class OpenMenuCommand : Command {
        public override string Help =>
            "altmenu=<x>x<y>: Focuses the menu bar (Alt key) in any state, and clicks at (x;y) relative to the image.";

        public override void Run(string param) {
            Process[] proc = GetPlayer();
            if (proc.Length != 0) {
                string[] pos = param.Split('x');
                if (pos.Length != 2) {
                    Console.WriteLine("The click position should be 2-dimensional, separated with an \"x\".");
                    return;
                }
                if (int.TryParse(pos[0].Trim(), out int x) && int.TryParse(pos[1].Trim(), out int y)) {
                    KeyPressTool.PressSystemKey(Keys.Alt, proc[0].MainWindowHandle);
                    Thread.Sleep(100);
                    ClickOnPointTool.ClickOnPoint(proc[0].MainWindowHandle, new Point(x, y));
                } else
                    Console.WriteLine("The dimensions of the position were not valid integers.");
            } else
                Console.WriteLine("MPC-HC is not running.");
        }
    }
}