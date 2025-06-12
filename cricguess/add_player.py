
#!/usr/bin/env python
import json
import os
import sys
import argparse

def load_data():
    """Load existing data from data.json"""
    try:
        with open('data.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        print("Error: Invalid JSON in data.json")
        return []

def save_data(data):
    """Save data to data.json"""
    with open('data.json', 'w') as f:
        json.dump(data, f, indent=4)

def add_player(image_url, runs):
    """Add a new player to the data"""
    data = load_data()
    
    # Validate inputs
    if not image_url.startswith(('http://', 'https://')):
        print("Error: Image URL must start with http:// or https://")
        return False
    
    if not isinstance(runs, int) or runs < 0 or runs > 500:
        print("Error: Runs must be a number between 0 and 500")
        return False
    
    # Check if image already exists
    for player in data:
        if player['image'] == image_url:
            print(f"Warning: Player with image URL '{image_url}' already exists with {player['price']} runs")
            return False
    
    # Add new player
    new_player = {
        "image": image_url,
        "price": runs
    }
    
    data.append(new_player)
    save_data(data)
    
    print(f"✅ Successfully added player with {runs} runs!")
    print(f"📊 Total players in database: {len(data)}")
    return True

def list_players():
    """List all players in the database"""
    data = load_data()
    print(f"\n📋 Cricket Players Database ({len(data)} players):")
    print("-" * 60)
    
    for i, player in enumerate(data, 1):
        print(f"{i:3}. {player['price']:3} runs - {player['image']}")

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    parser = argparse.ArgumentParser(description='Add cricket players to CricGuess game')
    parser.add_argument('--list', '-l', action='store_true', help='List all players')
    parser.add_argument('--image', '-i', type=str, help='Image URL')
    parser.add_argument('--runs', '-r', type=int, help='Runs scored')
    
    args = parser.parse_args()
    
    if args.list:
        list_players()
        return
    
    if args.image and args.runs is not None:
        add_player(args.image, args.runs)
        return
    
    # Interactive mode
    print("🏏 CricGuess Player Manager")
    print("=" * 30)
    
    while True:
        print("\nOptions:")
        print("1. Add new player")
        print("2. List all players")
        print("3. Exit")
        
        choice = input("\nEnter your choice (1-3): ").strip()
        
        if choice == '1':
            image_url = input("Enter image URL: ").strip()
            try:
                runs = int(input("Enter runs scored: ").strip())
                add_player(image_url, runs)
            except ValueError:
                print("Error: Please enter a valid number for runs")
        
        elif choice == '2':
            list_players()
        
        elif choice == '3':
            print("👋 Goodbye!")
            break
        
        else:
            print("Invalid choice. Please enter 1, 2, or 3.")

if __name__ == "__main__":
    main()
