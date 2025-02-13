#!/bin/sh
set -e

RED="\033[0;31m"
BLUE='\033[0;34m'
YELLOW='\033[0;33m'

GIT_ROOT=`git rev-parse --show-superproject-working-tree --show-toplevel | head -1`
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
DIR_ROOT=$(cd "$SCRIPT_DIR/../../.." && pwd)

BIN_PATH="${DIR_ROOT}/node_modules/.bin"
CONFIG_PATH="$(dirname "$SCRIPT_DIR")/configs"

HOOK_NAME=`basename $0`
LOCAL_HOOK="${GIT_ROOT}/.git/hooks/${HOOK_NAME}"
IGNORE_GLOBAL_HOOKS="${SCRIPT_DIR%/*}/IGNORE_GLOBAL_HOOKS"

# Execute project hooks first
if [ -x "$LOCAL_HOOK" ]; then
  "$LOCAL_HOOK"
  exit $?
fi

# Check if global hooks should be ignored
if [ -f "$IGNORE_GLOBAL_HOOKS" ] && grep -q "$GIT_ROOT" "$IGNORE_GLOBAL_HOOKS"; then
  exit 0
fi

export RED
export BLUE
export YELLOW
export BIN_PATH
export GIT_ROOT
export HOOK_NAME
export CONFIG_PATH
