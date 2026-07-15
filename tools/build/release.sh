#!/bin/sh

set -e

SUBMODULE_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/../../" && pwd)"
REGISTRY="http://libraries.assetroster.com:4873/"

build_and_publish() {
  for lib in "$@"; do
    echo "=== Building $lib ==="
    cd "$SUBMODULE_DIR/projects/$lib" || exit 1
    npx ng build --configuration production || { echo "Build failed for $lib"; exit 1; }

    echo "=== Packing $lib ==="
    cd "$SUBMODULE_DIR/dist/$lib" || exit 1
    npm pack || { echo "NPM pack failed for $lib"; exit 1; }

    echo "=== Publishing $lib to $REGISTRY ==="
    npm publish --registry "$REGISTRY" || { echo "Publish failed for $lib"; }

    cd "$SUBMODULE_DIR" || exit 1
    echo "=== $lib released successfully ==="
    echo ""
  done
}

echo "╔══════════════════════════════════════════════╗"
echo "║  BifiApp Full Release Pipeline              ║"
echo "║  Registry: $REGISTRY"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Layer 0 — Foundation
echo "═══════════════════════════════════════════════"
echo "  Layer 0: base-app"
echo "═══════════════════════════════════════════════"
build_and_publish base-app

# Layer 1 — Depend only on base-app
echo "═══════════════════════════════════════════════"
echo "  Layer 1: projects, inventory, asset-roster,"
echo "           website, aduanix, email-marketing"
echo "═══════════════════════════════════════════════"
build_and_publish projects inventory asset-roster website aduanix email-marketing

# Layer 2 — Depend on base-app + Layer 1
echo "═══════════════════════════════════════════════"
echo "  Layer 2: tasks, accounting"
echo "═══════════════════════════════════════════════"
build_and_publish tasks accounting

# Layer 3 — Depend on base-app + Layer 2
echo "══════════════════════════════════════════════========"
echo "  Layer 3: helpdesk, l10n_cr_einvoice sales purchases"
echo "═══════════════════════════════════════════════======="
build_and_publish helpdesk l10n_cr_einvoice sales purchases

# Layer 4 — Top of the graph
echo "═══════════════════════════════════════════════"
echo "  Layer 4: calendar"
echo "═══════════════════════════════════════════════"
build_and_publish calendar

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║  All libraries built and published!          ║"
echo "╚══════════════════════════════════════════════╝"
