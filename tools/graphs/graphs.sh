# before choosing, remove existing graphs
rm -f *.svg

LIBS=$(whiptail --title "Build Options" \
  --checklist "Choose the libs to graph:" 20 60 10 \
  "base-app"      "Base App library"      ON \
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

for LIB in $LIBS; do
  LIB=$(echo $LIB | tr -d '"')
  echo "Generating graph for $LIB..."
  npx depcruise --config .dependency-cruiser.js projects/$LIB --output-type dot | dot -Tsvg -o ${LIB}-graph.svg
done