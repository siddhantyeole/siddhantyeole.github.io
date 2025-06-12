
#!/bin/bash

echo "🏏 Add New Cricket Player"
echo "========================"

# Change to the script directory
cd "$(dirname "$0")"

# Get image URL
echo -n "Enter image URL: "
read image_url

# Get runs/price
echo -n "Enter runs scored: "
read runs

# Run the Python script with the inputs
python3 add_player.py --image "$image_url" --runs "$runs"
