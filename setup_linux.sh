#!/bin/bash

# Stop on errors
set -e

echo "Running npm install..."
npm install 

echo "Setting up Linux environment..."
echo "Installing Package Manager (Astral UV)..."
curl -LsSf https://astral.sh/uv/install.sh | sh

# Enter the chatbot folder
cd chatbot

echo "Running 'uv sync'..."
uv sync

echo "Downloading NLTK data by running the Python script..."
./.venv/bin/python3 script.py

echo "Python virtual environment setup complete."
echo "Activate the virtual environment using the command:"
echo "source ./chatbot/.venv/bin/activate"

# Return to the previous directory
cd ..

