LIBS=$(whiptail --title "Build Options" \
  --checklist "Choose the libs to build (base-app is always built):" 20 60 10 \
  "asset-roster"  "Asset Roster library"  OFF \
  "calendar"      "Calendar library"      OFF \
  "crm"           "CRM module"            OFF \
  "website"       "Website builder"       OFF \
  3>&1 1>&2 2>&3)

# ⛔ Detectar cancelación
if [ $? -ne 0 ]; then
  echo "Cancelled by user."
  exit 0
fi

# build base-app first
echo "Building base-app..."
cd ./projects/base-app || exit
ng build || { echo "Build failed for base-app"; exit 1; }
cd ../../dist/base-app || exit
npm pack || { echo "NPM pack failed for base-app"; exit 1; }
cd ../../ || exit

for LIB in $LIBS; do
  LIB=$(echo $LIB | tr -d '"')
  echo "Building $LIB..."
  cd ./projects/$LIB || exit
  ng build || { echo "Build failed for $LIB"; exit 1; }
  cd ../../dist/$LIB || exit
  npm pack || { echo "NPM pack failed for $LIB"; exit 1; }
  cd ../../ || exit
done