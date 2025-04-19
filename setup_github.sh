#!/bin/bash

# Check if arguments are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <github_username> <repository_name>"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME=$2
GITHUB_TOKEN=${GITHUB_TOKEN}

# Check if the token is available
if [ -z "$GITHUB_TOKEN" ]; then
    echo "Error: GITHUB_TOKEN environment variable is not set."
    exit 1
fi

# Set up remote URL with token authentication
GITHUB_URL="https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

# Check if repository exists on GitHub
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: token ${GITHUB_TOKEN}" https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME})

if [ "$HTTP_CODE" -eq 200 ]; then
    echo "Repository exists. Connecting to it..."
    
    # Check if origin already exists
    if git remote | grep -q "^origin$"; then
        echo "Remote 'origin' already exists. Updating URL..."
        git remote set-url origin "${GITHUB_URL}"
    else
        echo "Adding remote 'origin'..."
        git remote add origin "${GITHUB_URL}"
    fi
    
    echo "Successfully connected to ${GITHUB_USERNAME}/${REPO_NAME}"
    
    # Check if there are any commits
    if [ -z "$(git log -n 1 2>/dev/null)" ]; then
        echo "Repository is empty. Creating initial commit..."
        git add .
        git commit -m "Initial commit from Replit"
    fi
    
    # Try to pull first to avoid conflicts
    echo "Pulling from remote repository..."
    git pull origin main --allow-unrelated-histories || echo "No remote files to pull."
    
    # Push changes
    echo "Pushing all changes to remote repository..."
    git push -u origin main
else
    echo "Repository doesn't exist. Creating a new repository..."
    
    # Create repository on GitHub
    curl -H "Authorization: token ${GITHUB_TOKEN}" \
         -d "{\"name\":\"${REPO_NAME}\",\"description\":\"Replit project synchronized with GitHub\",\"private\":false}" \
         https://api.github.com/user/repos
    
    if [ $? -ne 0 ]; then
        echo "Failed to create repository."
        exit 1
    fi
    
    echo "Repository created. Connecting to it..."
    
    # Check if origin already exists
    if git remote | grep -q "^origin$"; then
        echo "Remote 'origin' already exists. Updating URL..."
        git remote set-url origin "${GITHUB_URL}"
    else
        echo "Adding remote 'origin'..."
        git remote add origin "${GITHUB_URL}"
    fi
    
    # Make sure we have at least one commit
    if [ -z "$(git log -n 1 2>/dev/null)" ]; then
        echo "Repository is empty. Creating initial commit..."
        git add .
        git commit -m "Initial commit from Replit"
    fi
    
    # Push all branches
    echo "Pushing all branches to remote repository..."
    git push -u origin main
fi

echo "GitHub integration complete!"
