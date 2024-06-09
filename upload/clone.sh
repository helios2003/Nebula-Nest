#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <github_username> <repository_name>"
    exit 1
fi

response=$(curl -s "https://api.github.com/repos/$1/$2" | grep '"size":')

if [ -n "$response" ]; then
    size=$(echo "$response" | awk -F': ' '{print $2}' | tr -d ',')
    echo "$size"
else
    echo 0
fi