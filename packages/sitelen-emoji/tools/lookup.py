#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

from profile import load_profile, resolve

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PROFILE = ROOT / "profiles" / "default-stable.v1.json"


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python tools/lookup.py <word> [<word> ...] [--profile PATH]")
        return 2

    args = sys.argv[1:]
    profile_path = DEFAULT_PROFILE

    if "--profile" in args:
        i = args.index("--profile")
        if i == len(args) - 1:
            print("Error: --profile requires a path")
            return 2
        profile_path = Path(args[i + 1])
        del args[i : i + 2]

    profile = load_profile(profile_path)

    rc = 0
    for w in args:
        e = resolve(w, profile)
        if e is None:
            print(f"{w}\t<missing>")
            rc = 1
        else:
            print(f"{w}\t{e}")
    return rc


if __name__ == "__main__":
    raise SystemExit(main())
