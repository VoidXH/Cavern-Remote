# Cavern Remote
Cavern Remote is a complete media player remote control webpage for Windows
hosted in MPC-HC with a responsive UI. It takes the default MPC-HC remote
website and extends the browser and controller with new features. Next to basic
player controls, it adds a shader preset selector, Equalizer APO configurator,
and keyboard/mouse control. The Remote is split into separate pages:
- **Browser**: Browse your local and labeled network drives for files to play.
- **Controls**: Basic playback info and controls with picture mode (shader
  preset) and sound mode (audio preset) selection, audio/subtitle track
  switching, and screen resizing.
- **Corrections**: Move or resize the screen if the content does not fit
  correctly. Audio delay is also adjustable from here.
- **DVD**: DVD menu navigation and audio/subtitle/angle selectors.
- **Pro**: Player menu control, playlist handling, fine controls, debug and
  setup options.

## Setup
0. Install MPC-HC. [The recommended version is by clsid2.](https://github.com/clsid2/mpc-hc/releases)
1. In MPC-HC options, under Web Interface, enable it on any port, and set these:
	- "Serve pages from" - tick this, and browse Cavern Remote's "web" folder.
	- "CGI handlers" - set this to Cavern Remote's "handler.exe", like
	`.md=C:\Cavern Remote\handler\handler.exe;`, but use the location you unzipped
  Cavern Remote to.
2. Check your local IP (open a command prompt and use the `ipconfig` command and
  look for `IPv4 Address`) and port (in MPC-HC's Web Interface settings), and
  merge them like `<IPv4 address>:<port>`. This will be the web address that
  opens Cavern Remote in your browser or on your phone. Create a shortcut if
  it's convenient.
3. Check all optional setup tasks, and do the ones you need.

### Optional: run MPC-HC as admin
For full functionality (keyboard, mouse, and Equalizer APO control), MPC-HC has
to run as admin. This is required because Equalizer APO keeps its configuration
files in the Program Files folder, and admin rights are needed to modify those.
For full transparency and as proof that it is not malicious, the source code of
the command handler is included under the `src` folder.

To set up MPC-HC with admin rights, open its properties from the installation
directory, go to the Compatibility, and in the settings for all users window,
you will find a check box to run as admin.

### Optional: start MPC-HC with the computer
If you didn't give admin right to MPC-HC, simply create a shortcut for it in the
Startup folder of your Start Menu. To open this folder, copy this path in the
file browser: `%appdata%\Microsoft\Windows\Start Menu\Programs\Startup`.

For applications that run with admin rights, the Start Menu version will not
work, nor adding an entry in the registry. This applications require a new task
in the Task Scheduler with the following options:
- Run with the highest privileges (tick on the first tab)
- On the Triggers tab, add a new trigger after login.
- On the Actions tab, add a new action to open MPC-HC.

If you use SVP, it also has to run as admin, and needs a separate task to start
with the system.

### Optional: setup Equalizer APO support
1. In `handler\apopath.txt`, set the location of Equalizer APO's config folder.
2. Add any custom presets in the `presets` folder. These must be a replacement
to Equalizer APO's main `config.txt`, and keep in mind that these will overwrite
the active configuration when selected. Make a backup of `config.txt` in
Equalizer APO's config folder first, or use Cavern Remote's backup feature on
the Pro page.
2. Open `web\_cavern.js` in any text editor and add the names of your presets to
the `apoPresetNames` list. Preserve the correct format, check the other array on
how to do this properly, and don't include the .txt extensions.

## Licence
The source code, just like the compiled software, is given to you for free, but
without any warranty. It is not guaranteed to work, and the developer is not
responsible for any damages from the use of the software. You are allowed to
make any modifications, and release them for free under this licence. If you
release a modified version, you have to link this repository as its source. You
are not allowed to sell any part of the original or the modified version. You
are also not allowed to show advertisements in the modified software. If you
include these code or any part of the original version in any other project,
these terms still apply.