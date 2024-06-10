#!/bin/bash

PID_FILE="./pids.txt"

if [ -f "$PID_FILE" ]; then
    while IFS= read -r pid; do
        if ps -p "$pid" > /dev/null; then
            echo "Stopping process with PID $pid"
            kill "$pid"
        else
            echo "Process with PID $pid not found"
        fi
    done < "$PID_FILE"
    rm "$PID_FILE"

    echo -e "\033[0;31m🛑 All servers have been stopped.\033[0m"
else
    echo -e "\033[0;31mAre the servers running?\033[0m"
fi

