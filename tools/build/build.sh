#!/bin/sh

# this will be used to build the libraries
SUBMODULE_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/../../" && pwd)"

# ---------- GET AVAILABLE LIBS ----------
AVAILABLE_LIBS=$(ls -1 ./projects | grep -v "base-app" | grep -v "asset-roster-demo")
LIBS=""

# ---------- PARSE --libs ----------
ARGS="$@"

set -- $ARGS
while [ $# -gt 0 ]; do
  if [ "$1" = "--libs" ]; then
    shift

    # If they say all → all libs
    if [ "$1" = "all" ]; then
      LIBS="$AVAILABLE_LIBS"
      shift
      break
    fi

    # Read libs until another flag or end
    while [ $# -gt 0 ] && [ "${1#--}" = "$1" ]; do
      LIBS="$LIBS $1"
      shift
    done

    break
  fi

  shift
done

# Normalize spaces
LIBS=$(echo "$LIBS" | xargs)

# ---------- INTERACTIVE MODE (only if LIBS is empty) ----------
if [ -z "$LIBS" ]; then
  CHOICES=""
  for LIB in $AVAILABLE_LIBS; do
      CHOICES="$CHOICES $LIB $LIB-library OFF"
  done
  
  SELECTED=$(whiptail --title "Build Options" \
    --checklist "Choose the libs to build (base-app is always built):" 20 60 10 \
    $CHOICES 3>&1 1>&2 2>&3)

  # Canceló
  if [ $? -ne 0 ]; then
    echo "Cancelled by user."
    exit 0
  fi

  # whiptail returns the choices with quotes and spaces, must clean up
  LIBS=$(echo "$SELECTED" | tr -d '"')
fi

{
  # ---------- ALWAYS BUILD base-app ----------
  echo "Building base-app..."
  cd "$SUBMODULE_DIR/projects/base-app" || exit 1
  ng build || { echo "Build failed for base-app"; exit 1; }

  cd ../../dist/base-app || exit 1
  npm pack || { echo "NPM pack failed for base-app"; exit 1; }
  cd ../../ || exit 1

  # ---------- BUILD EACH SELECTED LIB ----------
  for LIB in $LIBS; do
    echo "Building $LIB..."

    cd "$SUBMODULE_DIR/projects/$LIB" || exit 1
    ng build || { echo "Build failed for $LIB"; exit 1; }

    cd ../../dist/$LIB || exit 1
    npm pack || { echo "NPM pack failed for $LIB"; exit 1; }

    cd ../../ || exit 1
  done

  echo "Build complete."
} >&2

# Return the list of built libraries (for use in config-library.sh)
echo "$LIBS"