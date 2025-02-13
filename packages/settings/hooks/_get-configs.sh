#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_PATH="$SCRIPT_DIR/../configLoader"


if [ -f "${BASE_PATH}/index.js" ]; then
  CONFIG_FILE="${BASE_PATH}/index.js"
  TMP_FILE=$(mktemp)
  cat > "$TMP_FILE" << EOF
  const loadConfig = require('${BASE_PATH}/index.js');

  async function main() {
    try {
      const config = await loadConfig();
      if (!config) {
        console.error('No config found');
        process.exit(1);
      }
      console.log(JSON.stringify(config.configs));
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }

  main();
EOF
elif [ -f "${BASE_PATH}/index.mjs" ]; then
  CONFIG_FILE="${BASE_PATH}/index.mjs"
  TMP_FILE=$(mktemp)
  cat > "$TMP_FILE" << EOF
  import loadConfig from '${BASE_PATH}/index.mjs';

  async function main() {
    try {
      const config = await loadConfig();
      if (!config) {
        console.error('No config found');
        process.exit(1);
      }
      console.log(JSON.stringify(config.configs));
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }

  main();
EOF
else
  echo "Error: Neither index.js nor index.mjs found in ${BASE_PATH}"
  exit 1
fi


if [[ "$CONFIG_FILE" == *.mjs ]]; then
  CONFIGS=$(node --experimental-modules "$TMP_FILE")
else
  CONFIGS=$(node "$TMP_FILE")
fi

export CZG=$(node -e "console.log(${CONFIGS}.czg.binPath)")
export CZG_CONFIG=$(node -e "console.log(${CONFIGS}.czg.configPath)")

export LINT_STAGED=$(node -e "console.log(${CONFIGS}.lintStaged.binPath)")
export LINT_STAGED_CONFIG=$(node -e "console.log(${CONFIGS}.lintStaged.configPath)")

export COMMITLINT=$(node -e "console.log(${CONFIGS}.commitlint.binPath)")
export COMMITLINT_CONFIG=$(node -e "console.log(${CONFIGS}.commitlint.configPath)")


rm "$TMP_FILE"
