"""启动 3d-printer-live 桌面版，并在退出时清理本程序遗留的子进程。

上游 launch.py 只记录自己启动的数据桥进程，但数据桥可能再拉起 Chrome/Edge
直播间窗口；窗口关闭或异常退出后这些进程会留在桌面（表现为“程序关了，
网页还在/还在弹”）。这里在 launch.main() 返回后按命令行路径精确清理，
只匹配本目录下的进程，不影响用户自己开的浏览器窗口。
"""
import os
import subprocess
import sys
import time

ROOT = os.path.dirname(os.path.abspath(__file__))
APP = os.path.join(ROOT, "app")


def kill_leftovers():
    marker = APP.replace("'", "''")
    script = (
        "$m = '" + marker + "'; "
        "Get-CimInstance Win32_Process -Filter \"Name='node.exe' OR Name='chrome.exe' OR Name='msedge.exe'\" | "
        "Where-Object { $_.CommandLine -and $_.CommandLine.Contains($m) } | "
        "ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"
    )
    exe = os.path.join(os.environ.get("SystemRoot", r"C:\Windows"),
                       "System32", "WindowsPowerShell", "v1.0", "powershell.exe")
    if not os.path.exists(exe):
        exe = "powershell.exe"
    try:
        subprocess.run([exe, "-NoProfile", "-NonInteractive", "-Command", script],
                       timeout=20, creationflags=0x08000000,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception:
        pass


def main():
    sys.path.insert(0, APP)
    os.chdir(APP)
    import launch
    try:
        launch.main()
    finally:
        time.sleep(0.3)
        kill_leftovers()


if __name__ == "__main__":
    main()
