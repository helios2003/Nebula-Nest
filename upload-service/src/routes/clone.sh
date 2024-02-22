#!/bin/bash

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <github_username> <repository_name>"
    exit 1
fi

size=$(curl -s https://api.github.com/repos/$1/$2 2> /dev/null | grep size | tr -dc '[:digit:]')
echo $size
