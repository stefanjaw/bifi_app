AVAILABLE_LIBS="asset-roster calendar crm website"
LIBS=""

# ---------- PARSE --libs ----------
if [ "$1" = "--libs" ]; then
  shift

  # Si dicen all → todas las libs
  if [ "$1" = "all" ]; then
    LIBS="$AVAILABLE_LIBS"
  else
    # Leer hasta que no haya más argumentos
    while [ -n "$1" ]; do
      LIBS="$LIBS $1"
      shift
    done
  fi
fi

# ---------- MODO INTERACTIVO (solo si LIBS está vacío) ----------
if [ -z "$LIBS" ]; then
  CHOICES=$(whiptail --title "Build Options" \
    --checklist "Choose the libs to build (base-app is always built):" 20 60 10 \
    "asset-roster"  "Asset Roster library"  OFF \
    "calendar"      "Calendar library"      OFF \
    "crm"           "CRM module"            OFF \
    "website"       "Website builder"       OFF \
    3>&1 1>&2 2>&3)

  # Canceló
  if [ $? -ne 0 ]; then
    echo "Cancelled by user."
    exit 0
  fi

  # whiptail devuelve comillas → removerlas
  LIBS=$(echo "$CHOICES" | tr -d '"')
fi


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
