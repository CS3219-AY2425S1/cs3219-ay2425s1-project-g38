#!/bin/bash

# Change BASE TAG to your Docker Hub username
# This script assumes that you have already logged in to Docker Hub using `docker login`
BASE_TAG="jayllo"

# Check if a tag argument is provided
if [ -z "$1" ]; then
    echo "Error: No tag argument provided. Usage: ./push_images.sh <tag>"
    exit 1
fi

# Assign the tag argument (e.g., 'staging', 'v1', 'production') to a variable
TAG=$1

# Function to get the latest version of a service
get_latest_version() {
    service_name=$1
    # Get the list of existing tags from local Docker images (or adapt for Docker Hub)
    latest_version=$(docker images "$BASE_TAG/$service_name" --format "{{.Tag}}" | grep "$TAG" | sort -V | tail -n 1)

    if [ -z "$latest_version" ]; then
        # If no version is found, start with 0
        echo "0"
    else
        # Extract the X part of the version (customtag.X)
        echo "${latest_version##*.}"
    fi
}

# List of services with their respective directories
declare -A services=(
    ["matching-service"]="matching-service"
    ["question-service"]="question-service"
    ["user-service"]="user-service"
    ["frontend-peerprep"]="frontend/peerprep"
    ["collaboration-service"]="collaboration-service"
)

# Iterate over each service in the list
for service_name in "${!services[@]}"; do
    service_dir="${services[$service_name]}"

    # Get the latest version number for this service
    latest_version=$(get_latest_version "$service_name")

    # Increment the version number
    new_version=$((latest_version + 1))

    # Tag for the new image with version number (e.g., <tag>.1, <tag>.2)
    new_tag="$BASE_TAG/$service_name:$TAG.$new_version"

    # Tag for the latest custom environment (e.g., <tag>)
    latest_tag="$BASE_TAG/$service_name:$TAG"

    echo "Building $service_name from directory $service_dir with tags $new_tag and $latest_tag..."

    # Build the Docker image
    docker build -t "$new_tag" "$service_dir"

    # Tag the image with the 'latest' custom tag (e.g., <tag>)
    docker tag "$new_tag" "$latest_tag"

    # Push both the versioned image and the 'latest' custom tag in parallel
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
