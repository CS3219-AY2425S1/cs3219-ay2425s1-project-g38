#!/bin/bash

# Change BASE TAG to your Docker Hub username
BASE_TAG="asia-southeast1-docker.pkg.dev/peerprep-437117/peerprep"

# Check if a tag argument was provided; otherwise, print an error and exit
if [ -z "$1" ]; then
    echo "Error: A tag argument is required. Usage: $0 <tag>"
    exit 1
else
    VERSION="$1"
fi

# List of services with their respective directories
declare -A services=(
    # ["matching-service"]="matching-service"
    # ["question-service"]="question-service"
    # ["user-service"]="user-service"
    # ["frontend-peerprep"]="frontend/peerprep"
    ["collaboration-service"]="collaboration-service"
)

# Track the result of each build and push
declare -A results
push_failed=0

# Iterate over each service and run the build/push pipeline in parallel
for service_name in "${!services[@]}"; do
    (
        service_dir="${services[$service_name]}"
        custom_tag="$BASE_TAG/$service_name:$VERSION"
        latest_tag="$BASE_TAG/$service_name:latest"

        echo "Building and pushing $service_name with tags $custom_tag and $latest_tag..."

        # Build the Docker image
        if docker build -t "$custom_tag" "$service_dir"; then
            # Tag and push if build succeeds
            docker tag "$custom_tag" "$latest_tag"
            if docker push "$custom_tag" && docker push "$latest_tag"; then
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
