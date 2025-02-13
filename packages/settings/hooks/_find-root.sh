#!/bin/bash

parse_json_array() {
    local json="$1"
    local key="$2"
    # simple json parse
    echo "$json" | grep -o "\"$key\"\s*:\s*\[\([^]]*\)\]" | grep -o '\["[^"]*"[^]]*\]' | tr -d '[]"' | tr ',' '\n' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
}

parse_yaml_array() {
    local file="$1"
    # simple YAML parse
    grep "^[[:space:]]*-" "$file" | sed 's/^[[:space:]]*-[[:space:]]*//'
}

find_globs() {
    local dir="$1"
    
    # check lerna.json
    if [ -f "$dir/lerna.json" ]; then
        local content=$(cat "$dir/lerna.json")
        local packages=$(parse_json_array "$content" "packages")
        if [ ! -z "$packages" ]; then
            echo "$packages"
            return 0
        fi
    fi

    # check pnpm-workspace.yaml
    if [ -f "$dir/pnpm-workspace.yaml" ]; then
        if grep -q "^packages:" "$dir/pnpm-workspace.yaml"; then
            parse_yaml_array "$dir/pnpm-workspace.yaml"
            return 0
        else
            # pnpm default
            echo "**"
            return 0
        fi
    fi

    # check package.json
    if [ -f "$dir/package.json" ]; then
        local content=$(cat "$dir/package.json")
        
        # check directly workspaces array
        local workspaces=$(parse_json_array "$content" "workspaces")
        if [ ! -z "$workspaces" ]; then
            echo "$workspaces"
            return 0
        fi
        
        # check workspaces.packages
        if echo "$content" | grep -q "\"workspaces\".*{.*\"packages\".*\["; then
            local workspace_packages=$(echo "$content" | grep -o '"workspaces".*"packages".*\[[^]]*\]' | grep -o '\["[^"]*"[^]]*\]' | tr -d '[]"' | tr ',' '\n' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
            if [ ! -z "$workspace_packages" ]; then
                echo "$workspace_packages"
                return 0
            fi
        fi
        
        # check bolt.workspaces
        if echo "$content" | grep -q "\"bolt\".*{.*\"workspaces\".*\["; then
            local bolt_workspaces=$(echo "$content" | grep -o '"bolt".*"workspaces".*\[[^]]*\]' | grep -o '\["[^"]*"[^]]*\]' | tr -d '[]"' | tr ',' '\n' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
            if [ ! -z "$bolt_workspaces" ]; then
                echo "$bolt_workspaces"
                return 0
            fi
        fi
    fi

    return 1
}

find_root() {
    local dir="$(cd "$1" && pwd)"
    local stop_dir="$(cd "${2:-/}" && pwd)"
    
    while true; do
        if globs=$(find_globs "$dir"); then
            printf "%s\n---WORKSPACE_GLOBS---\n%s" "$dir" "$globs"
            return 0
        fi
        
        # get parent dir
        local parent_dir="$(cd "$dir/.." 2>/dev/null && pwd)"
        
        # check if is root and stop
        if [ "$dir" = "$stop_dir" ] || [ "$parent_dir" = "$dir" ] || [ -z "$parent_dir" ]; then
            printf "cannot find workspace\n" >&2
            return 1
        fi
        
        dir="$parent_dir"
    done
}

# examples
# search from current pwd
# find_root "$(pwd)"

# or specify a start dir and stop dir
# find_root "/path/to/start" "/path/to/stop"