from __future__ import annotations

import argparse
from pathlib import Path

REQUIRED = ("Mathematical target", "Evidence level", "Computational model", "Coverage and bounds", "Controls", "Checkpoint and manifest", "Proof gap")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("plan", type=Path)
    args = parser.parse_args()
    text = args.plan.read_text(encoding="utf-8")
    missing = [section for section in REQUIRED if section not in text]
    if missing:
        raise SystemExit("missing sections: " + ", ".join(missing))
    print(f"valid experiment plan: {args.plan}")


if __name__ == "__main__":
    main()
