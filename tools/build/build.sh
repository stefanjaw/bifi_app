AVAILABLE_LIBS=$(ls -1 ./projects | grep -v "base-app" | grep -v "asset-roster-demo")
LIBS=""

# ---------- PARSE --libs ----------
if [ "$1" = "--libs" ]; then
  shift

  # If they say all → all libs
  if [ "$1" = "all" ]; then
    LIBS="$AVAILABLE_LIBS"
  else
    # Read until there are no more arguments
    while [ -n "$1" ]; do
      LIBS="$LIBS $1"
      shift
    done
  fi
fi

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
  cd ./projects/base-app || exit 1
  ng build || { echo "Build failed for base-app"; exit 1; }

  cd ../../dist/base-app || exit 1
  npm pack || { echo "NPM pack failed for base-app"; exit 1; }
  cd ../../ || exit 1

  # ---------- BUILD EACH SELECTED LIB ----------
  for LIB in $LIBS; do
    echo "Building $LIB..."

    cd ./projects/$LIB || exit 1
    ng build || { echo "Build failed for $LIB"; exit 1; }

    cd ../../dist/$LIB || exit 1
    npm pack || { echo "NPM pack failed for $LIB"; exit 1; }

    cd ../../ || exit 1
  done

  echo "Build complete."
} >&2

# Return the list of built libraries (for use in config-library.sh)
echo "$LIBS"