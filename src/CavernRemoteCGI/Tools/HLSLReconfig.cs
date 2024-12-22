using System;
using System.Globalization;
using System.IO;

namespace CavernRemoteCGI.Tools {
    /// <summary>
    /// Allows modifying configuration values in Cinema Shader Pack files.
    /// </summary>
    public static class HLSLReconfig {
        /// <summary>
        /// Load a HLSL file from a <paramref name="path"/>, add a <paramref name="change"/> to a <paramref name="property"/>, which is
        /// contained in a const static float, then save the file if a change was made.
        /// </summary>
        public static void Modify(string path, string property, float change) {
            string[] lines = File.ReadAllLines(path);
            bool changed = false;
            for (int i = 0; i < lines.Length; i++) {
                if (!lines[i].StartsWith(lineStart)) {
                    continue;
                }

                int start = lines[i].IndexOf('=', lineStart.Length) + 1;
                string fileProperty = lines[i].Substring(lineStart.Length, lines[i].LastIndexOf(' ', start - 2) - lineStart.Length);
                if (!string.Equals(fileProperty, property, StringComparison.InvariantCultureIgnoreCase)) {
                    continue;
                }

                string cut = lines[i].Substring(start, lines[i].LastIndexOf(';') - start).Trim();
                if (!float.TryParse(cut, NumberStyles.Any, CultureInfo.InvariantCulture, out float value)) {
                    Console.WriteLine($"Unable to parse {cut}.");
                    return;
                }

                value += change;
                if (Math.Abs(value) < .0001f) {
                    value = 0;
                }
                lines[i] = $"{lineStart}{fileProperty} = {value.ToString(CultureInfo.InvariantCulture)};";
                changed = true;
            }

            if (changed) {
                File.WriteAllLines(path, lines);
            } else {
                Console.WriteLine($"No change was made as the parameter ({property}) was not found in {Path.GetFileName(path)}.");
            }
        }

        /// <summary>
        /// Beginning of a modifiable configuration value line.
        /// </summary>
        const string lineStart = "const static float ";
    }
}