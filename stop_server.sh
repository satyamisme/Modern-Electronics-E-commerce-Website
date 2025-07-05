#!/bin/bash

echo "Stopping Vite development server..."

if [ -f server.pid ]; then
    PID=$(cat server.pid)
    if ps -p $PID > /dev/null; then
        kill $PID
        echo "Server with PID $PID stopped."
    else
        echo "Server with PID $PID not found. It might have already been stopped."
    fi
    rm server.pid
else
    echo "server.pid not found. Is the server running or was it started with start_server.sh?"
fi

# Make the script executable
chmod +x stop_server.sh
