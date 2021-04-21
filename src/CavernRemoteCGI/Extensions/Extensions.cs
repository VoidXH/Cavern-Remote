using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text;

internal static class Extensions {
    [DllImport("Kernel32.dll")]
    private static extern bool QueryFullProcessImageName([In] IntPtr hProcess, [In] uint dwFlags,
        [Out] StringBuilder lpExeName, [In, Out] ref uint lpdwSize);

    // https://stackoverflow.com/questions/5497064/how-to-get-the-full-path-of-running-process/46671939#46671939
    public static string GetMainModuleFileName(this Process process, int buffer = 1024) {
        var fileNameBuilder = new StringBuilder(buffer);
        uint bufferLength = (uint)fileNameBuilder.Capacity + 1;
        return QueryFullProcessImageName(process.Handle, 0, fileNameBuilder, ref bufferLength) ?
            fileNameBuilder.ToString() : null;
    }
}