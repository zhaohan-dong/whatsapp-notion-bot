#!/bin/bash

# Start logging in the background
docker-compose logs -f > ./dockerlogs.log &

# Start the services
docker-compose up -d

# Function to check if notion-integration is running
is_notion_running() {
    docker-compose ps | grep 'notion-integration' | grep 'Up' > /dev/null
    return $?
}

# Monitor for die events and check if notion-integration has stopped
docker events --filter 'event=die' | while read event
do
    if ! is_notion_running; then
        echo "notion-integration has stopped. Stopping all services..."
        docker-compose down
        exit 0
    fi
done
