
import pandas as pd
import csv

# Read the main people CSV file
people_df = pd.read_csv('people (2).csv')

# Read the names/aliases CSV file
names_df = pd.read_csv('names (3).csv')

# Create a dictionary to map identifiers to aliases
aliases_dict = {}
for _, row in names_df.iterrows():
    identifier = row['identifier']
    name = row['name']
    
    if identifier not in aliases_dict:
        aliases_dict[identifier] = []
    
    # Only add if it's different from the main name
    if name not in aliases_dict[identifier]:
        aliases_dict[identifier].append(name)

# Add ESPNCricinfo link column
def create_cricinfo_url(key_cricinfo):
    if pd.isna(key_cricinfo) or key_cricinfo == '':
        return ''
    return f"https://www.espncricinfo.com/cricketers/{key_cricinfo}"

people_df['espncricinfo_url'] = people_df['key_cricinfo'].apply(create_cricinfo_url)

# Add aliases column
def get_aliases(identifier):
    if identifier in aliases_dict:
        # Join all aliases with semicolon separator
        return '; '.join(aliases_dict[identifier])
    return ''

people_df['aliases'] = people_df['identifier'].apply(get_aliases)

# Save the updated CSV
people_df.to_csv('people_updated.csv', index=False)

print(f"Successfully processed {len(people_df)} players")
print(f"Added ESPNCricinfo URLs for {len(people_df[people_df['espncricinfo_url'] != ''])} players")
print(f"Added aliases for {len(people_df[people_df['aliases'] != ''])} players")
print("Updated file saved as 'people_updated.csv'")

# Display first few rows to verify
print("\nFirst 5 rows of updated data:")
print(people_df[['name', 'espncricinfo_url', 'aliases']].head())
