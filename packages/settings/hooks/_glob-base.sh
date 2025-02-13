#!/bin/bash

is_extglob() {
    local str="$1"
    [[ "$str" =~ [@?!+*]\(.*\) ]] && return 0
    return 1
}

is_glob_strict() {
    local str="$1"
    
    # if is start with !, return true
    [[ "${str:0:1}" == "!" ]] && return 0
    
    local i=0
    while [ $i -lt ${#str} ]; do
        local char="${str:$i:1}"
        local next_char="${str:$((i+1)):1}"
        
        # if is glob char, return true
        [[ "$char" == "*" ]] && return 0
        [[ "$char" == "?" ]] && return 0
        [[ "$char" == "[" && "$next_char" != "]" ]] && return 0
        [[ "$char" == "{" && "$next_char" != "}" ]] && return 0
        
        # if is escape char, skip next char
        if [[ "$char" == "\\" ]]; then
            i=$((i + 2))
            continue
        fi
        
        i=$((i + 1))
    done
    
    return 1
}

# looser check if is glob mode
is_glob_relaxed() {
    local str="$1"
    
    [[ "${str:0:1}" == "!" ]] && return 0
    [[ "$str" =~ [\*\?\{\}\(\)\[\]] ]] && return 0
    
    return 1
}

# main glob check function
is_glob() {
    local str="$1"
    local strict=${2:-true}
    
    # check input
    [ -z "$str" ] && return 1
    
    # check extglob
    is_extglob "$str" && return 0
    
    # choose check method by strict mode
    if [ "$strict" = true ]; then
        is_glob_strict "$str"
    else
        is_glob_relaxed "$str"
    fi
}

# get glob parent dir
glob_parent() {
    local pattern="$1"
    local result
    
    # normalize path separator
    pattern=$(echo "$pattern" | sed 's/\\/\//g')
    
    # handle special case
    [[ "$pattern" =~ [\{\[] ]] && pattern="$pattern/"
    
    # add placeholder to keep full path
    pattern="${pattern}a"
    
    # loop get parent dir until not glob mode
    while true; do
        result=$(dirname "$pattern")
        if ! is_glob "$result"; then
            echo "$result" | sed 's/\\//g'
            return 0
        fi
        pattern="$result"
    done
}

# main glob_base function
glob_base() {
    local pattern="$1"
    
    # check input
    [ -z "$pattern" ] && {
        echo "错误：需要一个字符串参数" >&2
        return 1
    }
    
    local base glob is_glob_pattern
    
    # get base path
    base=$(glob_parent "$pattern")
    is_glob_pattern=$(is_glob "$pattern" && echo "true" || echo "false")
    
    # handle glob part
    if [ "$base" != "." ]; then
        glob=${pattern#"$base"}
        glob=${glob#/}
    else
        glob=$pattern
    fi
    
    # if not glob mode
    if [ "$is_glob_pattern" = "false" ]; then
        base=$(dirname "$pattern")
        if [ "$base" != "." ]; then
            glob=${pattern#"$base"}
            glob=${glob#/}
        else
            glob=$pattern
        fi
    fi
    
    # clean glob path
    glob=${glob#./}
    glob=${glob#/}
    
    # output result
    cat << EOF
  {
      "base": "$base",
      "glob": "$glob",
      "isGlob": $is_glob_pattern
  }
EOF
}

# example:
# glob_base "path/to/*.js"