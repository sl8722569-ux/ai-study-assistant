#!/usr/bin/env bash
set -euo pipefail
SRC="$(cd "$(dirname "$0")/../../web" && pwd)"
DEST="${HOME}/.local/share/ai-study-assistant"
mkdir -p "$DEST" "${HOME}/.local/share/applications"
cp -a "$SRC/." "$DEST/"
cat > "${HOME}/.local/share/applications/ai-study-assistant.desktop" <<EOF
[Desktop Entry]
Name=AI Study Assistant
Exec=xdg-open $DEST/index.html
Type=Application
Categories=Education;
EOF
echo "Installed. Open $DEST/index.html or the desktop entry."
echo "Or use the website (install as PWA from the browser)."
