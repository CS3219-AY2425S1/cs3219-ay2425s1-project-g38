#!/bin/bash

# Change BASE TAG to your Docker Hub username
BASE_TAG="delishad21"
VERSION_BASE="dev1.0."
VERSION="dev"

# Function to get the latest version of a service
get_latest_version() {
    service_name=$1
    latest_version=$(docker images "$BASE_TAG/$service_name" --format "{{.Tag}}" | grep "$VERSION_BASE" | sort -V | tail -n 1)

    if [ -z "$latest_version" ]; then
        echo "0"
    else
        echo "${latest_version##*.}"
    fi
}

# List of services with their respective directories
declare -A services=(
    # ["matching-service"]="matching-service"
    # ["question-service"]="question-service"
    # ["user-service"]="user-service"
    ["frontend-peerprep"]="frontend/peerprep"
    # ["collaboration-service"]="collaboration-service"
)

# Track the result of each build and push
declare -A results
push_failed=0

# Iterate over each service and run the build/push pipeline in parallel
for service_name in "${!services[@]}"; do
    (
        service_dir="${services[$service_name]}"
        latest_version=$(get_latest_version "$service_name")
        new_version=$((latest_version + 1))
        new_tag="$BASE_TAG/$service_name:$VERSION_BASE$new_version"
        latest_tag="$BASE_TAG/$service_name:dev"

        echo "Building and pushing $service_name..."

        # Build the Docker image
        if docker build -t "$new_tag" "$service_dir"; then
            # Tag and push if build succeeds
            docker tag "$new_tag" "$latest_tag"
            if docker push "$new_tag" && docker push "$latest_tag"; then
                results["$service_name"]="Success"
            else
                echo "Error: Failed to push $service_name"
                results["$service_name"]="Push failed"
                push_failed=1
            fi
        else
            echo "Error: Failed to build $service_name"
            results["$service_name"]="Build failed"
            push_failed=1
        fi
    ) &
done

# Wait for all background tasks to complete
wait

# Display results summary
echo -e "\nSummary of Docker Builds and Pushes:"
for service_name in "${!services[@]}"; do
    if [ "${results[$service_name]}" != "Success" ]; then
        echo "$service_name: ${results[$service_name]}"
    else
        echo "$service_name: Successfully built and pushed"
    fi
done

# Check if any push failed
if [ $push_failed -ne 0 ]; then
    echo "One or more services failed. Check the output above for details."
    exit 1
else
    echo "All services have been built, tagged, and pushed successfully!"
fi
