#!/bin/sh

# this will be used to configure the parent project files based on selected options

# ---------- CONSTANTS ----------

PARENT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/../../../" && pwd)"
SUBMODULE_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/../../" && pwd)"

echo "📁 Parent directory: $PARENT_DIR"
echo "📁 Submodule directory: $SUBMODULE_DIR"

# ---------- PULL LASTEST BRANCH AND CHANGES ----------

echo "🔄 Pulling latest changes in submodule... on $SUBMODULE_DIR"
git submodule update --progress --init --recursive
git -C "$SUBMODULE_DIR" checkout angularv20
git -C "$SUBMODULE_DIR" pull

# ---------- INSTALL SUBMODULE DEPENDENCIES ----------

echo "📦 Installing submodule dependencies... on $SUBMODULE_DIR"
npm install --prefix "$SUBMODULE_DIR" || { echo "❌ Failed to install submodule dependencies"; exit 1; }

# ---------- RUN BUILD SCRIPT TO GET SELECTED LIBRARIES ----------

LIBS="$(sh "$SUBMODULE_DIR/tools/build/build.sh" "$@")"
echo "✅ Selected libraries to config: $LIBS"

# Check if user cancelled the build process
if [ "$LIBS" = "Cancelled by user." ]; then
    exit 0
fi

# ---------- INSTALL LIBRARIES IN PARENT PROJECT ----------

# Iterate over selected libraries and find dist tgz paths
BASE_APP_DIST_DIR="$PARENT_DIR/bifi_app/dist/base-app"
BASE_APP_TGZ=$(ls "$BASE_APP_DIST_DIR"/*.tgz 2>/dev/null | head -n 1)

LIB_PATHS="$BASE_APP_TGZ"

for LIB in $LIBS; do
    DIST_DIR="$PARENT_DIR/bifi_app/dist/$LIB"

    if [ -d "$DIST_DIR" ]; then
        TGZ_FILE=$(ls "$DIST_DIR"/*.tgz 2>/dev/null | head -n 1)

        if [ -n "$TGZ_FILE" ]; then
            LIB_PATHS="$LIB_PATHS $TGZ_FILE"
        else
            echo "⚠️ Warning: No .tgz file found in $DIST_DIR for library $LIB"
        fi
    else
        echo "⚠️ Warning: Distribution directory $DIST_DIR does not exist for library $LIB"
    fi
done

echo "📦 Library package paths: $LIB_PATHS"

# Install everything and then install the libraries in the parent project
echo "🧹 Cleaning parent project package-lock.json... on $PARENT_DIR"
rm "$PARENT_DIR/package-lock.json"

echo "📦 Installing parent project dependencies... on $PARENT_DIR"
npm install --prefix "$PARENT_DIR" || { echo "❌ Failed to install parent project dependencies"; exit 1; }

echo "📦 Installing libraries in parent project... on $PARENT_DIR"
npm install --prefix "$PARENT_DIR" $LIB_PATHS || { echo "❌ Failed to install libraries in parent project"; exit 1; }

# ---------- UPDATE CONFIG FILES ----------

# Configure environment variables for templates
ENVIRONMENT_DIR="$PARENT_DIR/src/environments"
ENVIRONMENT_PATH="$ENVIRONMENT_DIR/environment.ts"

# Set the environment file path, if not created, create it
mkdir -p "$ENVIRONMENT_DIR"
[ ! -f "$ENVIRONMENT_PATH" ] && touch "$ENVIRONMENT_PATH"

echo "📝 environment.ts created at $ENVIRONMENT_PATH — insert credentials manually before building"

# Ask for title, if provided as argument, use it
APP_TITLE=""

for ARG in "$@"; do
  case "$ARG" in
    --title=*)
      APP_TITLE="${ARG#*=}"
      ;;
  esac
done

if [ -z "$APP_TITLE" ]; then
  read -r -p "📝 Enter the application title: " APP_TITLE
fi

export APP_TITLE

# This function generates a file from a template using envsubst
generate_file() {
    local template="$1"
    local output="$2"

    if [ ! -f "$template" ]; then
        echo "❌ Template not found: $template"
        return 1
    fi

    envsubst < "$template" > "$output"

    echo "✅ Generated: $output"
}

# Set the routes file path, if not created, create it
CONFIG_DIR="$PARENT_DIR/src/app"
mkdir -p "$CONFIG_DIR"

# Generate app.routes.ts
ROUTES_PATH="$CONFIG_DIR/app.routes.ts"
[ ! -f "$ROUTES_PATH" ] && touch "$ROUTES_PATH"
generate_file "$SUBMODULE_DIR/tools/config/app.routes.ts.txt" "$ROUTES_PATH"

# Generate PRIMENG preset
PRIMENG_PATH="$CONFIG_DIR/primeng.preset.ts"
[ ! -f "$PRIMENG_PATH" ] && touch "$PRIMENG_PATH"
generate_file "$SUBMODULE_DIR/tools/config/primeng.preset.ts.txt" "$PRIMENG_PATH"

# Generate styles.css
STYLES_PATH="$PARENT_DIR/src/styles.css"
[ ! -f "$STYLES_PATH" ] && touch "$STYLES_PATH"
generate_file "$SUBMODULE_DIR/tools/config/styles.css.txt" "$STYLES_PATH"

# Generate .postcssrc.json
POSTCSS_PATH="$PARENT_DIR/.postcssrc.json"
[ ! -f "$POSTCSS_PATH" ] && touch "$POSTCSS_PATH"
generate_file "$SUBMODULE_DIR/tools/config/.postcssrc.json.txt" "$POSTCSS_PATH"

# Generate app.html and app.ts
HTML_PATH="$CONFIG_DIR/app.html"
TS_PATH="$CONFIG_DIR/app.ts"

[ ! -f "$HTML_PATH" ] && touch "$HTML_PATH"
[ ! -f "$TS_PATH" ] && touch "$TS_PATH"

generate_file "$SUBMODULE_DIR/tools/config/app.html.txt" "$HTML_PATH"
generate_file "$SUBMODULE_DIR/tools/config/app.ts.txt" "$TS_PATH"

# Calculate providers based on selected libraries
PROVIDERS=""
PROVIDER_IMPORTS=""
SEP=""

# Iterate over selected libraries to extract provider names
for LIB in $LIBS; do
    PROVIDER_FILE="$SUBMODULE_DIR/projects/$LIB/src/lib/providers/provider.ts"

    if [ -f "$PROVIDER_FILE" ]; then
        PROVIDER_NAME=$(grep -E 'export (const|function) provide' "$PROVIDER_FILE" | head -n 1 | awk '{print $3}' | tr -d ':=')

        if [ -n "$PROVIDER_NAME" ]; then
            echo "✅ Provider found: $PROVIDER_NAME"
            CLEAN_NAME=$(echo "$PROVIDER_NAME" | sed 's/()//g')

            # Add the provider name to the lists
            PROVIDERS="$PROVIDERS$SEP$CLEAN_NAME()"
            PROVIDER_IMPORTS="$PROVIDER_IMPORTS import { $CLEAN_NAME } from '@avalantec/$LIB';"
            SEP=", "
        else
            echo "⚠️ Warning: No provider found in $PROVIDER_FILE"
        fi
    else
        echo "⚠️ Warning: Provider file does not exist: $PROVIDER_FILE"
    fi
done

export PROVIDERS
export PROVIDER_IMPORTS

# Generate app.config.ts
CONFIG_PATH="$CONFIG_DIR/app.config.ts"
[ ! -f "$CONFIG_PATH" ] && touch "$CONFIG_PATH"
generate_file "$SUBMODULE_DIR/tools/config/app.config.ts.txt" "$CONFIG_PATH"

echo "✅ Providers ADDED: $PROVIDERS"
echo "✅ Provider IMPORTS: $PROVIDER_IMPORTS"

# ---------- CONFIGURING MAXIMUM BUDGET ON ANGULAR.JSON ----------

ANGULAR_JSON_PATH="$PARENT_DIR/angular.json"
sed -i 's/"maximumError": "1MB"/"maximumError": "10MB"/' "$ANGULAR_JSON_PATH"
echo "✅ Updated maximumError budget in angular.json to 10MB"

# ---------- CONFIGURING PREBUILD IF --prebuild flag is used ----------

# Check for --prebuild flag
PREBUILD=false
PREBUILD_ARG=""

for ARG in "$@"; do
   case "$ARG" in
    --prebuild=*)
      PREBUILD_ARG="${ARG#*=}"
      PREBUILD=true
      ;;
  esac
done

# If PREBUILD is true, TRIGGER PREBUILD ACTIONS
if [ "$PREBUILD" = true ]; then
    echo "📦 --prebuild flag detected, triggering prebuild actions."
    npm run pre:build --prefix "$SUBMODULE_DIR" -- "--apiURL=$PREBUILD_ARG" || { echo "❌ Failed to run prebuild actions"; exit 1; }
else
    echo "📦 No --prebuild flag detected, skipping prebuild actions."
fi

# ---------- BUILDING PARENT PROJECT ----------
echo "📦 Building parent project..."
npm run build --prefix "$PARENT_DIR" || { echo "Failed to build parent project"; exit 1; }