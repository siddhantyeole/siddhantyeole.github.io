import pandas as pd
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from bs4 import BeautifulSoup
import time
import json
import re
from datetime import datetime
import random
from urllib.parse import urljoin, urlparse


class CricketPlayerScraper:

    def __init__(self, csv_file='people (2).csv'):
        self.players_df = pd.read_csv(csv_file)
        self.scraped_data = []
        self.base_url = "https://www.espncricinfo.com/cricketers"
        
        # List of realistic user agents to rotate
        self.user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ]
        
        # Create session with enhanced configuration
        self.session = requests.Session()
        
        # Set default headers to mimic a real browser
        self.session.headers.update({
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0',
            'DNT': '1'
        })
        
        retry_strategy = Retry(
            total=5,
            backoff_factor=3,
            status_forcelist=[403, 429, 500, 502, 503, 504]
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)

    def scrape_player_data(self, name, key_cricinfo, max_retries=5):
        """Scrape individual player data from ESPNCricinfo"""
        url = f"{self.base_url}/{name}-{key_cricinfo}"

        for attempt in range(max_retries):
            try:
                # Rotate user agent for each attempt
                user_agent = random.choice(self.user_agents)
                
                # Create headers with rotated user agent
                headers = {
                    'User-Agent': user_agent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'cross-site',
                    'Sec-Fetch-User': '?1',
                    'Cache-Control': 'max-age=0',
                    'DNT': '1',
                    'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                    'Sec-Ch-Ua-Mobile': '?0',
                    'Sec-Ch-Ua-Platform': '"Windows"'
                }
                
                # Add random delay with exponential backoff
                base_delay = 2 ** attempt
                delay = random.uniform(base_delay, base_delay * 2)
                time.sleep(delay)
                
                # Make request with longer timeout
                response = self.session.get(url, headers=headers, timeout=30)
                
                if response.status_code == 403:
                    print(f"403 Forbidden - attempt {attempt + 1}/{max_retries} for {name}")
                    if attempt < max_retries - 1:
                        # Longer delay before retry for 403
                        wait_time = random.uniform(10, 20)
                        print(f"Waiting {wait_time:.1f}s before retry...")
                        time.sleep(wait_time)
                        continue
                    else:
                        print(f"All attempts failed for {name} - may need alternative data source")
                        return None
                
                response.raise_for_status()

                soup = BeautifulSoup(response.content, 'html.parser')

                player_data = {
                    'name': name.replace('-', ' ').title(),
                    'key_cricinfo': key_cricinfo,
                    'url': url,
                    'scraped_at': datetime.now().isoformat()
                }

                # Extract basic information
                player_data.update(self._extract_basic_info(soup))

                # Extract career statistics
                player_data.update(self._extract_career_stats(soup))

                # Extract team information
                player_data.update(self._extract_team_info(soup))

                return player_data

            except Exception as e:
                print(f"Attempt {attempt + 1} failed for {name}: {str(e)}")
                if attempt < max_retries - 1:
                    delay = random.uniform(3, 7)  # Random delay between attempts
                    print(f"Waiting {delay:.1f}s before retry...")
                    time.sleep(delay)
                else:
                    return None

    def _extract_basic_info(self, soup):
        """Extract basic player information"""
        info = {}

        # Full name
        name_elem = soup.find('h1')
        if name_elem:
            info['full_name'] = name_elem.get_text().strip()

        # Birth date
        born_elem = soup.find('span', string='Born')
        if born_elem and born_elem.parent:
            born_text = born_elem.parent.get_text()
            # Extract date from text like "Born: January 1, 1990, City, Country"
            date_match = re.search(r'(\w+ \d+, \d{4})', born_text)
            if date_match:
                info['date_of_birth'] = date_match.group(1)

        return info

    def _extract_team_info(self, soup):
        """Extract team information"""
        teams_info = {'teams': []}

        # Look for teams section
        teams_section = soup.find('div', class_='player-card-data')
        if teams_section:
            team_links = teams_section.find_all('a')
            for link in team_links:
                team_name = link.get_text().strip()
                if team_name and len(team_name) > 1:
                    teams_info['teams'].append(team_name)

        return teams_info

    def _extract_career_stats(self, soup):
        """Extract career statistics for Test and ODI formats"""
        stats = {'test_stats': {}, 'odi_stats': {}}

        # Look for career averages table
        tables = soup.find_all('table')

        for table in tables:
            # Check if this is a career averages table
            headers = table.find_all('th')
            if not headers:
                continue

            header_texts = [h.get_text().strip() for h in headers]

            # Look for batting statistics
            if any('Mat' in h and 'Inns' in header_texts
                   for h in header_texts):
                rows = table.find_all('tr')[1:]  # Skip header

                for row in rows:
                    cells = row.find_all(['td', 'th'])
                    if len(cells) < 6:
                        continue

                    format_name = cells[0].get_text().strip().lower()

                    if 'test' in format_name:
                        stats['test_stats'].update(
                            self._parse_batting_row(cells))
                    elif 'odi' in format_name or 'one day' in format_name:
                        stats['odi_stats'].update(
                            self._parse_batting_row(cells))

        # Look for bowling statistics
        self._extract_bowling_stats(soup, stats)

        return stats

    def _parse_batting_row(self, cells):
        """Parse batting statistics from table row"""
        try:
            return {
                'matches':
                self._safe_int(cells[1].get_text()),
                'innings':
                self._safe_int(cells[2].get_text()),
                'runs':
                self._safe_int(cells[3].get_text()),
                'batting_avg':
                self._safe_float(cells[4].get_text()),
                'hundreds':
                self._safe_int(cells[5].get_text()) if len(cells) > 5 else 0,
                'fifties':
                self._safe_int(cells[6].get_text()) if len(cells) > 6 else 0,
                'fours':
                self._safe_int(cells[7].get_text()) if len(cells) > 7 else 0,
                'sixes':
                self._safe_int(cells[8].get_text()) if len(cells) > 8 else 0,
                'strike_rate':
                self._safe_float(cells[9].get_text()) if len(cells) > 9 else 0
            }
        except:
            return {}

    def _extract_bowling_stats(self, soup, stats):
        """Extract bowling statistics"""
        bowling_tables = soup.find_all('table')

        for table in bowling_tables:
            headers = table.find_all('th')
            header_texts = [h.get_text().strip() for h in headers]

            # Look for bowling statistics table
            if any('Wkts' in h or 'Wickets' in h for h in header_texts):
                rows = table.find_all('tr')[1:]

                for row in rows:
                    cells = row.find_all(['td', 'th'])
                    format_name = cells[0].get_text().strip().lower()

                    bowling_stats = self._parse_bowling_row(cells)

                    if 'test' in format_name:
                        stats['test_stats'].update(bowling_stats)
                    elif 'odi' in format_name:
                        stats['odi_stats'].update(bowling_stats)

    def _parse_bowling_row(self, cells):
        """Parse bowling statistics from table row"""
        try:
            return {
                'wickets':
                self._safe_int(cells[4].get_text()) if len(cells) > 4 else 0,
                'bowling_avg':
                self._safe_float(cells[5].get_text()) if len(cells) > 5 else 0,
                'economy':
                self._safe_float(cells[6].get_text()) if len(cells) > 6 else 0,
                'four_wickets':
                self._safe_int(cells[7].get_text()) if len(cells) > 7 else 0,
                'five_wickets':
                self._safe_int(cells[8].get_text()) if len(cells) > 8 else 0
            }
        except:
            return {}

    def _safe_int(self, text):
        """Safely convert text to integer"""
        try:
            return int(re.sub(r'[^\d]', '', str(text)))
        except:
            return 0

    def _safe_float(self, text):
        """Safely convert text to float"""
        try:
            clean_text = re.sub(r'[^\d.]', '', str(text))
            return float(clean_text) if clean_text else 0.0
        except:
            return 0.0

    def scrape_all_players(self, limit=None, delay=10):
        """Scrape data for all players in the CSV"""
        total_players = len(self.players_df) if limit is None else min(
            limit, len(self.players_df))

        print(f"Starting to scrape {total_players} players...")

        for index, row in self.players_df.iterrows():
            if limit and index >= limit:
                break

            print(
                f"Scraping player {index + 1}/{total_players}: {row['name']}")

            player_data = self.scrape_player_data(row['name'],
                                                  row['key_cricinfo'])

            if player_data:
                self.scraped_data.append(player_data)
                print(f"✓ Successfully scraped {row['name']}")
            else:
                print(f"✗ Failed to scrape {row['name']}")

            # Be very respectful to the server with longer delays
            if index < total_players - 1:  # Don't delay after the last player
                wait_time = random.uniform(delay, delay * 2)
                print(f"Waiting {wait_time:.1f}s before next request...")
                time.sleep(wait_time)

    def save_data(self, filename='cricket_players_data.json'):
        """Save scraped data to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.scraped_data, f, indent=2, ensure_ascii=False)
        print(f"Saved {len(self.scraped_data)} player records to {filename}")

    def save_to_csv(self, filename='cricket_players_data.csv'):
        """Save scraped data to CSV file"""
        if not self.scraped_data:
            print("No data to save")
            return

        # Flatten the nested data for CSV
        flattened_data = []
        for player in self.scraped_data:
            flat_player = {
                'name':
                player.get('name', ''),
                'full_name':
                player.get('full_name', ''),
                'date_of_birth':
                player.get('date_of_birth', ''),
                'teams':
                ', '.join(player.get('teams', [])),
                'url':
                player.get('url', ''),

                # Test stats
                'test_matches':
                player.get('test_stats', {}).get('matches', 0),
                'test_innings':
                player.get('test_stats', {}).get('innings', 0),
                'test_runs':
                player.get('test_stats', {}).get('runs', 0),
                'test_batting_avg':
                player.get('test_stats', {}).get('batting_avg', 0),
                'test_hundreds':
                player.get('test_stats', {}).get('hundreds', 0),
                'test_fifties':
                player.get('test_stats', {}).get('fifties', 0),
                'test_fours':
                player.get('test_stats', {}).get('fours', 0),
                'test_sixes':
                player.get('test_stats', {}).get('sixes', 0),
                'test_strike_rate':
                player.get('test_stats', {}).get('strike_rate', 0),
                'test_wickets':
                player.get('test_stats', {}).get('wickets', 0),
                'test_bowling_avg':
                player.get('test_stats', {}).get('bowling_avg', 0),
                'test_economy':
                player.get('test_stats', {}).get('economy', 0),
                'test_four_wickets':
                player.get('test_stats', {}).get('four_wickets', 0),
                'test_five_wickets':
                player.get('test_stats', {}).get('five_wickets', 0),

                # ODI stats
                'odi_matches':
                player.get('odi_stats', {}).get('matches', 0),
                'odi_innings':
                player.get('odi_stats', {}).get('innings', 0),
                'odi_runs':
                player.get('odi_stats', {}).get('runs', 0),
                'odi_batting_avg':
                player.get('odi_stats', {}).get('batting_avg', 0),
                'odi_hundreds':
                player.get('odi_stats', {}).get('hundreds', 0),
                'odi_fifties':
                player.get('odi_stats', {}).get('fifties', 0),
                'odi_fours':
                player.get('odi_stats', {}).get('fours', 0),
                'odi_sixes':
                player.get('odi_stats', {}).get('sixes', 0),
                'odi_strike_rate':
                player.get('odi_stats', {}).get('strike_rate', 0),
                'odi_wickets':
                player.get('odi_stats', {}).get('wickets', 0),
                'odi_bowling_avg':
                player.get('odi_stats', {}).get('bowling_avg', 0),
                'odi_economy':
                player.get('odi_stats', {}).get('economy', 0),
                'odi_four_wickets':
                player.get('odi_stats', {}).get('four_wickets', 0),
                'odi_five_wickets':
                player.get('odi_stats', {}).get('five_wickets', 0),
            }
            flattened_data.append(flat_player)

        df = pd.DataFrame(flattened_data)
        df.to_csv(filename, index=False)
        print(f"Saved {len(flattened_data)} player records to {filename}")


# Usage example
if __name__ == "__main__":
    scraper = CricketPlayerScraper('people (2).csv')

    # Test with first 5 players
    scraper.scrape_all_players(limit=5, delay=2)

    # Save the data
    scraper.save_data('cricket_players_sample.json')
    scraper.save_to_csv('cricket_players_sample.csv')
