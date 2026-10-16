crisiana.saavedra@Criss-MacBook-Neo Calculator % git add .
crisiana.saavedra@Criss-MacBook-Neo Calculator % git commit -m " Calculator modification by Cris Ian Saavedra"
[main 1e2598e]  Calculator modification by Cris Ian Saavedra
 6 files changed, 969 insertions(+), 138 deletions(-)
 create mode 100644 assets/relapse.mp4
 create mode 100644 screens/calculator.js
 create mode 100644 screens/vault.js
crisiana.saavedra@Criss-MacBook-Neo Calculator % git push
To https://github.com/Hjoemarc/Calculator.git
 ! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs to 'https://github.com/Hjoemarc/Calculator.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. If you want to integrate the remote changes,
hint: use 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
crisiana.saavedra@Criss-MacBook-Neo Calculator % git pull
hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:
hint:
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint:
hint: You can replace "git config" with "git config --global" to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.
fatal: Need to specify how to reconcile divergent branches.
crisiana.saavedra@Criss-MacBook-Neo Calculator % git pull origin main --no-rebase
From https://github.com/Hjoemarc/Calculator
 * branch            main       -> FETCH_HEAD
Auto-merging App.js
CONFLICT (content): Merge conflict in App.js
Automatic merge failed; fix conflicts and then commit the result.
crisiana.saavedra@Criss-MacBook-Neo Calculator % git push origin main
To https://github.com/Hjoemarc/Calculator.git
 ! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs to 'https://github.com/Hjoemarc/Calculator.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. If you want to integrate the remote changes,
hint: use 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
crisiana.saavedra@Criss-MacBook-Neo Calculator % npx expo start
Starting project at /Users/crisiana.saavedra/Documents/Calculator
› Port 8081 is running this app in another window
  /Users/crisiana.saavedra/Documents/Calculator (pid 14043)
✔ Use port 8082 instead? … yes
Starting Metro Bundler

▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █   █▄▄█▄▀█ ▄▄▄▄▄ █
█ █   █ █ ▀▄ █▀█ ██ █   █ █
█ █▄▄▄█ █▀██▀▀█▀▄██ █▄▄▄█ █
█▄▄▄▄▄▄▄█▄▀▄█ █▄█▄█▄▄▄▄▄▄▄█
█ ▄▀▀▄▄▄█▀▀▀▄▀█▄ ███ ▀▄▄ ▄█
█▀▄█   ▄█▀█▀ ▄██ ▀▀ █▄  ▀██
█ ▀ ▀▄ ▄██▀▄█▄▀▄▀▄▀▄▀▀▄ ▀██
███ ▄▄█▄▄█▀██▀██▄▄▄█▄▀ ▀███
█▄▄▄██▄▄█▀▄█▄▀█▄▄ ▄▄▄ ▀ ▄▄█
█ ▄▄▄▄▄ █▀██ ▄██▀ █▄█ ▀▀█▀█
█ █   █ █▄▄▄█▄▀▄█▄▄ ▄▄▀   █
█ █▄▄▄█ █▀  █▀▄█▄██▄▀█▀▀ ██
█▄▄▄▄▄▄▄█▄█▄▄▄▄▄████▄▄▄▄▄▄█

› Scan the QR code above to open in Expo Go.
› Metro: exp://192.168.1.56:8082
› Web: http://localhost:8082

› Using Expo Go (Press s to switch to development build)
› Press ? │ show all commands

Logs for your project will appear below. Press Ctrl+C to exit.
› Open in the web browser...
› Press ? │ show all commands
Web Bundled 241ms index.js (508 modules)
Web  INFO  %cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold
Web  WARN  [expo-av]: Expo AV has been deprecated and will be removed in SDK 54. Use the `expo-audio` and `expo-video` packages to replace the required functionality.
Web  LOG  Running application "main" with appParams:
 {"hydrate": undefined, "rootTag": "#root"} 
Development-level warnings: ON.
Performance optimizations: OFF.
Web Bundled 33ms index.js (1 module)
Web  WARN  [expo-av]: Expo AV has been deprecated and will be removed in SDK 54. Use the `expo-audio` and `expo-video` packages to replace the required functionality.
Web  LOG  Running application "main" with appParams:
 {"hydrate": undefined, "rootTag": "#root"} 
Development-level warnings: ON.
Performance optimizations: OFF.
Web  LOG  ⚠️ [expo-av]: Video component from `expo-av` is deprecated in favor of `expo-video`. See the documentation at https://docs.expo.dev/versions/latest/sdk/video/ for the new API reference.
› Stopped server
crisiana.saavedra@Criss-MacBook-Neo Calculator % git reset --soft HEAD~1
fatal: Cannot do a soft reset in the middle of a merge.
crisiana.saavedra@Criss-MacBook-Neo Calculator % git merge --abort
crisiana.saavedra@Criss-MacBook-Neo Calculator % git reset --soft HEAD~1
crisiana.saavedra@Criss-MacBook-Neo Calculator % git -v 
git version 2.50.1 (Apple Git-155)
crisiana.saavedra@Criss-MacBook-Neo Calculator % git remote -v
origin  https://github.com/Hjoemarc/Calculator.git (fetch)
origin  https://github.com/Hjoemarc/Calculator.git (push)
crisiana.saavedra@Criss-MacBook-Neo Calculator % git add .
crisiana.saavedra@Criss-MacBook-Neo Calculator % git commit -m "Calculator modification by Cris Ian"      
[main 3861c74] Calculator modification by Cris Ian
 4 files changed, 957 insertions(+), 126 deletions(-)
 create mode 100644 assets/relapse.mp4
crisiana.saavedra@Criss-MacBook-Neo Calculator % git pull origin main
remote: Enumerating objects: 14, done.
remote: Counting objects: 100% (13/13), done.
remote: Compressing objects: 100% (3/3), done.
remote: Total 8 (delta 5), reused 8 (delta 5), pack-reused 0 (from 0)
Unpacking objects: 100% (8/8), 3.35 KiB | 381.00 KiB/s, done.
From https://github.com/Hjoemarc/Calculator
 * branch            main       -> FETCH_HEAD
   2c61ec4..1f22003  main       -> origin/main
hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:
hint:
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint:
hint: You can replace "git config" with "git config --global" to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.
fatal: Need to specify how to reconcile divergent branches.
crisiana.saavedra@Criss-MacBook-Neo Calculator % git pull origin main --no-rebase
From https://github.com/Hjoemarc/Calculator
 * branch            main       -> FETCH_HEAD
Auto-merging App.js
CONFLICT (content): Merge conflict in App.js
Auto-merging package-lock.json
Automatic merge failed; fix conflicts and then commit the result.
crisiana.saavedra@Criss-MacBook-Neo Calculator % npx expo strt 
Invalid project root: /Users/crisiana.saavedra/Documents/Calculator/strt
crisiana.saavedra@Criss-MacBook-Neo Calculator % npx expo start
Starting project at /Users/crisiana.saavedra/Documents/Calculator
› Port 8081 is running this app in another window
  /Users/crisiana.saavedra/Documents/Calculator (pid 14043)
✔ Use port 8082 instead? … yes
Starting Metro Bundler

▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █   █▄▄█▄▀█ ▄▄▄▄▄ █
█ █   █ █ ▀▄ █▀█ ██ █   █ █
█ █▄▄▄█ █▀██▀▀█▀▄██ █▄▄▄█ █
█▄▄▄▄▄▄▄█▄▀▄█ █▄█▄█▄▄▄▄▄▄▄█
█ ▄▀▀▄▄▄█▀▀▀▄▀█▄ ███ ▀▄▄ ▄█
█▀▄█   ▄█▀█▀ ▄██ ▀▀ █▄  ▀██
█ ▀ ▀▄ ▄██▀▄█▄▀▄▀▄▀▄▀▀▄ ▀██
███ ▄▄█▄▄█▀██▀██▄▄▄█▄▀ ▀███
█▄▄▄██▄▄█▀▄█▄▀█▄▄ ▄▄▄ ▀ ▄▄█
█ ▄▄▄▄▄ █▀██ ▄██▀ █▄█ ▀▀█▀█
█ █   █ █▄▄▄█▄▀▄█▄▄ ▄▄▀   █
█ █▄▄▄█ █▀  █▀▄█▄██▄▀█▀▀ ██
█▄▄▄▄▄▄▄█▄█▄▄▄▄▄████▄▄▄▄▄▄█

› Scan the QR code above to open in Expo Go.
› Metro: exp://192.168.1.56:8082
› Web: http://localhost:8082

› Using Expo Go (Press s to switch to development build)
› Press ? │ show all commands

Logs for your project will appear below. Press Ctrl+C to exit.
› Open in the web browser...
› Press ? │ show all commands
Web Bundled 181ms index.js (366 modules)
Web  INFO  %cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold
Web  WARN  [expo-av]: Expo AV has been deprecated and will be removed in SDK 54. Use the `expo-audio` and `expo-video` packages to replace the required functionality.
Web  LOG  Running application "main" with appParams:
 {"hydrate": undefined, "rootTag": "#root"} 
Development-level warnings: ON.
Performance optimizations: OFF.
Web Bundled 20ms index.js (1 module)
Web  WARN  [expo-av]: Expo AV has been deprecated and will be removed in SDK 54. Use the `expo-audio` and `expo-video` packages to replace the required functionality.
Web  LOG  Running application "main" with appParams:
 {"hydrate": undefined, "rootTag": "#root"} 
Development-level warnings: ON.
Performance optimizations: OFF.
› Stopped server
crisiana.saavedra@Criss-MacBook-Neo Calculator % git merge --abort
crisiana.saavedra@Criss-MacBook-Neo Calculator % git reset --soft HEAD~1
crisiana.saavedra@Criss-MacBook-Neo Calculator % git add .
crisiana.saavedra@Criss-MacBook-Neo Calculator % git commit -m, "Calculator modification by Cris Ian"
error: pathspec 'Calculator modification by Cris Ian' did not match any file(s) known to git
crisiana.saavedra@Criss-MacBook-Neo Calculator % git commit -m "Calculator modification by Cris Ian"
[main b9db61c] Calculator modification by Cris Ian
 4 files changed, 957 insertions(+), 126 deletions(-)
 create mode 100644 assets/relapse.mp4
crisiana.saavedra@Criss-MacBook-Neo Calculator % git pull origin main --no-rebase
From https://github.com/Hjoemarc/Calculator
 * branch            main       -> FETCH_HEAD
Auto-merging App.js
CONFLICT (content): Merge conflict in App.js
Auto-merging package-lock.json
Automatic merge failed; fix conflicts and then commit the result.
crisiana.saavedra@Criss-MacBook-Neo Calculator % git merge --abort
crisiana.saavedra@Criss-MacBook-Neo Calculator % git reset --soft HEAD~1
crisiana.saavedra@Criss-MacBook-Neo Calculator % git pull origin main --no-rebase
remote: Enumerating objects: 18, done.
remote: Counting objects: 100% (18/18), done.
remote: Compressing objects: 100% (4/4), done.
remote: Total 12 (delta 8), reused 12 (delta 8), pack-reused 0 (from 0)
Unpacking objects: 100% (12/12), 2.61 KiB | 121.00 KiB/s, done.
From https://github.com/Hjoemarc/Calculator
 * branch            main       -> FETCH_HEAD
   1f22003..d0532bd  main       -> origin/main
Updating 04e9859..d0532bd
error: Your local changes to the following files would be overwritten by merge:
        App.js
        package-lock.json
Please commit your changes or stash them before you merge.
Aborting
crisiana.saavedra@Criss-MacBook-Neo Calculator % git add .
crisiana.saavedra@Criss-MacBook-Neo Calculator % git commit -m "Calculator Modify by Cris Ian Saavedra"   
[main bf86ce8] Calculator Modify by Cris Ian Saavedra
 4 files changed, 957 insertions(+), 126 deletions(-)
 create mode 100644 assets/relapse.mp4
crisiana.saavedra@Criss-MacBook-Neo Calculator % git pull origin main --no-rebase
From https://github.com/Hjoemarc/Calculator
 * branch            main       -> FETCH_HEAD
Auto-merging App.js
CONFLICT (content): Merge conflict in App.js
Auto-merging package-lock.json
Automatic merge failed; fix conflicts and then commit the result.
crisiana.saavedra@Criss-MacBook-Neo Calculator %     