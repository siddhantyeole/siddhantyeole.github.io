
#!/bin/bash

# Make the script executable and navigate to cricguess directory
cd "$(dirname "$0")"

echo "🏏 CricGuess Player Manager"
echo "=========================="

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    exit 1
fi

# Run the Python script with arguments
python3 add_player.py "$@"
