using System;
using System.Runtime.InteropServices;

namespace CavernRemoteCGI.CoreAudio {
    /// <summary>
    /// Controls audio using the Windows CoreAudio API
    /// from: http://stackoverflow.com/questions/14306048/controling-volume-mixer
    /// and: http://netcoreaudio.codeplex.com/
    /// </summary>
    public static class AudioManager {
        /// <summary>
        /// Gets the current master volume in scalar values (percentage)
        /// </summary>
        /// <returns>-1 in case of an error, if successful the value will be between 0 and 100</returns>
        public static float GetMasterVolume() {
            IAudioEndpointVolume masterVol = null;
            try {
                masterVol = GetMasterVolumeObject();
                if (masterVol == null)
                    return -1;

                masterVol.GetMasterVolumeLevelScalar(out float volumeLevel);
                return volumeLevel * 100;
            } finally {
                if (masterVol != null)
                    Marshal.ReleaseComObject(masterVol);
            }
        }

        /// <summary>
        /// Gets the mute state of the master volume. 
        /// While the volume can be muted the <see cref="GetMasterVolume"/> will still return the pre-muted volume value.
        /// </summary>
        /// <returns>false if not muted, true if volume is muted</returns>
        public static bool GetMasterVolumeMute() {
            IAudioEndpointVolume masterVol = null;
            try {
                masterVol = GetMasterVolumeObject();
                if (masterVol == null)
                    return false;

                masterVol.GetMute(out bool isMuted);
                return isMuted;
            } finally {
                if (masterVol != null)
                    Marshal.ReleaseComObject(masterVol);
            }
        }

        /// <summary>
        /// Sets the master volume to a specific level
        /// </summary>
        /// <param name="newLevel">Value between 0 and 100 indicating the desired scalar value of the volume</param>
        public static void SetMasterVolume(float newLevel) {
            IAudioEndpointVolume masterVol = null;
            try {
                masterVol = GetMasterVolumeObject();
                if (masterVol == null)
                    return;

                masterVol.SetMasterVolumeLevelScalar(newLevel / 100, Guid.Empty);
            } finally {
                if (masterVol != null)
                    Marshal.ReleaseComObject(masterVol);
            }
        }

        /// <summary>
        /// Mute or unmute the master volume
        /// </summary>
        /// <param name="isMuted">true to mute the master volume, false to unmute</param>
        public static void SetMasterVolumeMute(bool isMuted) {
            IAudioEndpointVolume masterVol = null;
            try {
                masterVol = GetMasterVolumeObject();
                if (masterVol == null)
                    return;

                masterVol.SetMute(isMuted, Guid.Empty);
            } finally {
                if (masterVol != null)
                    Marshal.ReleaseComObject(masterVol);
            }
        }

        private static IAudioEndpointVolume GetMasterVolumeObject() {
            IMMDeviceEnumerator deviceEnumerator = null;
            IMMDevice speakers = null;
            try {
                deviceEnumerator = (IMMDeviceEnumerator)(new MMDeviceEnumerator());
                deviceEnumerator.GetDefaultAudioEndpoint(EDataFlow.eRender, ERole.eMultimedia, out speakers);

                Guid IID_IAudioEndpointVolume = typeof(IAudioEndpointVolume).GUID;
                speakers.Activate(ref IID_IAudioEndpointVolume, 0, IntPtr.Zero, out object o);
                IAudioEndpointVolume masterVol = (IAudioEndpointVolume)o;

                return masterVol;
            } finally {
                if (speakers != null) Marshal.ReleaseComObject(speakers);
                if (deviceEnumerator != null) Marshal.ReleaseComObject(deviceEnumerator);
            }
        }
    }
}