#!/bin/bash

# Change BASE TAG to your Docker Hub username
# This script assumes that you have already logged in to Docker Hub using `docker login`
BASE_TAG="delishad21"
VERSION_BASE="dev1.0."

# Function to get the latest version of a service
get_latest_version() {
    service_name=$1
    # Get the list of existing tags from local Docker images (or adapt for Docker Hub)
    latest_version=$(docker images "$BASE_TAG/$service_name" --format "{{.Tag}}" | grep "$VERSION_BASE" | sort -V | tail -n 1)

    if [ -z "$latest_version" ]; then
        # If no version is found, start with 0
        echo "0"
    else
        # Extract the X part of the version (dev1.0.X)
        echo "${latest_version##*.}"
    fi
}

# List of services with their respective directories
declare -A services=(
    ["matching-service"]="matching-service"
    ["question-service"]="question-service"
    ["user-service"]="user-service"
    ["frontend-peerprep"]="frontend/peerprep"
)

# Iterate over each service in the list
for service_name in "${!services[@]}"; do
    service_dir="${services[$service_name]}"

    # Get the latest version number for this service
    latest_version=$(get_latest_version "$service_name")

    # Increment the version number
    new_version=$((latest_version + 1))

    # Tag for the new image with version number (e.g., dev1.0.X)
    new_tag="$BASE_TAG/$service_name:$VERSION_BASE$new_version"

    # Tag for the latest development image (e.g., dev)
    latest_tag="$BASE_TAG/$service_name:dev"

    echo "Building $service_name from directory $service_dir with tags $new_tag and $latest_tag..."

    # Build the Docker image
    docker build -t "$new_tag" "$service_dir"

    # Tag the same image as 'dev'
    docker tag "$new_tag" "$latest_tag"

    # Push both the versioned image and the 'dev' image in parallel
    (
        docker push "$new_tag" && \
        echo "Successfully pushed $service_name as $new_tag" && \
        docker push "$latest_tag" && \
        echo "Successfully pushed $service_name as $latest_tag"
    ) &
done

# Wait for all background pushes to complete
wait

echo "All services have been built, tagged, and pushed!"
