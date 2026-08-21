#!/usr/bin/env bash
set -euo pipefail
SRC="$(cd "$(dirname "$0")/../../web" && pwd)"
DEST="${HOME}/Applications/AI Study Assistant"
mkdir -p "$DEST"
cp -a "$SRC/." "$DEST/"
open "$DEST/index.html"
echo "Opened locally. In Safari: Share → Add to Dock / Home Screen for app mode."
