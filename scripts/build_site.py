#!/usr/bin/env python3
"""Build/check Korean columns and language editions in the required order."""
import argparse
from pathlib import Path
import subprocess
import sys

ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--check',action='store_true')
args=parser.parse_args()
for name in ('build_columns.py','build_i18n.py','check_i18n.py'):
    command=[sys.executable,'-X','utf8',str(ROOT/'scripts'/name)]
    if args.check and name!='check_i18n.py': command.append('--check')
    result=subprocess.run(command,cwd=ROOT)
    if result.returncode: raise SystemExit(result.returncode)
