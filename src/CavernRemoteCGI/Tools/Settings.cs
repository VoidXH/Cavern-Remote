using System.Collections.Generic;
using System.IO;
using System.Reflection;

namespace CavernRemoteCGI.Tools {
    public class Settings {
        const string fileName = "Cavern Remote Handler.ini";

        public string this[string key] => dict[key];

        readonly Dictionary<string, string> dict = new Dictionary<string, string>();
        readonly string path;

        public Settings() {
            path = Path.Combine(Path.GetDirectoryName(Assembly.GetEntryAssembly().Location), fileName);
            if (File.Exists(path)) {
                string[] settings = File.ReadAllLines(path);
                for (int line = 0; line < settings.Length; ++line) {
                    int index = settings[line].IndexOf('=');
                    if (index != -1) {
                        dict.Add(settings[line].Substring(0, index), settings[line].Substring(index + 1));
                    }
                }
            }
        }

        public bool HasKey(string key) => dict.ContainsKey(key);

        public void Set(string key, string value) {
            if (dict.ContainsKey(key)) {
                dict[key] = value;
            } else {
                dict.Add(key, value);
            }
        }

        public void Save() {
            string[] lines = new string[dict.Count];
            int i = 0;
            foreach (KeyValuePair<string, string> pair in dict) {
                lines[i++] = $"{pair.Key}={pair.Value}";
            }
            File.WriteAllLines(path, lines);
        }
    }
}