"""
InnovArt desktop launcher.

Starts the FastAPI backend on localhost, opens the dashboard in an
Edge app-mode window (falls back to the default browser), and shuts the
server down automatically once the dashboard is closed.

This is the PyInstaller entry point for InnovArt.exe.
"""

import os
import subprocess
import sys
import threading
import time
import urllib.request
import webbrowser

PORT = int(os.environ.get("INNOVART_PORT", "8765"))
URL = f"http://127.0.0.1:{PORT}"

EDGE_PATHS = [
    os.path.expandvars(r"%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"),
    os.path.expandvars(r"%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"),
    os.path.expandvars(r"%LocalAppData%\Microsoft\Edge\Application\msedge.exe"),
]


def server_alive() -> bool:
    try:
        with urllib.request.urlopen(f"{URL}/api/health", timeout=1.5) as res:
            return res.status == 200
    except Exception:
        return False


def open_window() -> None:
    """Open the dashboard - chromeless Edge app window if available."""
    for edge in EDGE_PATHS:
        if os.path.isfile(edge):
            subprocess.Popen(
                [edge, f"--app={URL}", "--window-size=1440,900"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            return
    webbrowser.open(URL)


def _setup_frozen_logging() -> None:
    """In the windowed exe there is no console; send output to a log file."""
    if not getattr(sys, "frozen", False):
        return
    from server.db import get_data_dir

    log = open(get_data_dir() / "innovart.log", "a", buffering=1, encoding="utf-8")
    sys.stdout = sys.stderr = log


def main() -> int:
    _setup_frozen_logging()
    # Another InnovArt instance already running: just open a window on it.
    if server_alive():
        open_window()
        return 0

    import uvicorn
    from server.app import app, LAST_REQUEST

    server_thread = threading.Thread(
        target=lambda: uvicorn.run(app, host="127.0.0.1", port=PORT, log_level="warning"),
        daemon=True,
    )
    server_thread.start()

    for _ in range(60):  # wait up to 15s for startup
        if server_alive():
            break
        time.sleep(0.25)
    else:
        return 1

    open_window()

    # Watchdog: the dashboard pings /api/health every 15s while open.
    # 60s grace at startup, then exit after 45s of silence.
    started = time.time()
    while True:
        time.sleep(5)
        idle = time.time() - LAST_REQUEST["t"]
        if time.time() - started > 60 and idle > 45:
            return 0


if __name__ == "__main__":
    sys.exit(main())
