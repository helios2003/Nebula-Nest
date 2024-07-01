#!/bin/bash
PID_FILE="./pids.txt"

directories=('./upload' './deploy' './wss' './health')

> "$PID_FILE"

for dir in "${directories[@]}"
do
	cd "$dir" || exit
	echo "Installing the dependencies in $dir"
	npm install
	echo "Building in $dir"
	npm run build
	echo "Starting the server in $dir"
	npm run dev &
	cd - || exit
done

echo -e "\033[0;32m🎉🎊 Your project has started, please check the logs to see if infrastructure has been set up\033[0m"
