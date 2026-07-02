#!/bin/bash

# Go to the folder where this script lives
cd "$(dirname "$0")"

echo
echo "========================================"
echo " Mountaineer Uniform Database"
echo " Asset Builder"
echo "========================================"
echo

python3 generate_assets.py

echo
echo "========================================"
echo "Finished!"
echo
echo "Press ENTER to close..."
read