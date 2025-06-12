from cricket_scraper import CricketPlayerScraper
import sys


def main():
    print("🏏 Cricket Player Data Scraper")
    print("=" * 40)

    # Initialize scraper
    scraper = CricketPlayerScraper('people (2).csv')

    # Ask user how many players to scrape
    try:
        total_players = len(scraper.players_df)
        print(f"Found {total_players} players in the CSV file.")

        while True:
            response = input(
                f"How many players to scrape? (1-{total_players}, or 'all'): "
            ).strip()

            if response.lower() == 'all':
                limit = None
                break
            elif response.isdigit():
                limit = int(response)
                if 1 <= limit <= total_players:
                    break
                else:
                    print(
                        f"Please enter a number between 1 and {total_players}")
            else:
                print("Please enter a valid number or 'all'")

        # Set delay between requests
        delay = float(
            input("Delay between requests in seconds (recommended: 5-10): ")
            or "5")

        print(f"\nStarting scraping process...")
        print(f"Players to scrape: {limit or total_players}")
        print(f"Delay between requests: {delay}s")
        print("Press Ctrl+C to stop at any time\n")

        # Start scraping
        scraper.scrape_all_players(limit=limit, delay=delay)

        # Save results
        if scraper.scraped_data:
            print(
                f"\n✅ Scraping completed! Successfully scraped {len(scraper.scraped_data)} players"
            )

            # Save in both formats
            scraper.save_data('cricket_players_data.json')
            scraper.save_to_csv('cricket_players_data.csv')

            print("\n📁 Files created:")
            print("  • cricket_players_data.json (detailed data)")
            print("  • cricket_players_data.csv (flattened data)")

        else:
            print("❌ No data was scraped successfully")

    except KeyboardInterrupt:
        print(f"\n⏹️ Scraping stopped by user")
        if scraper.scraped_data:
            print(
                f"Saving {len(scraper.scraped_data)} players scraped so far..."
            )
            scraper.save_data('cricket_players_partial.json')
            scraper.save_to_csv('cricket_players_partial.csv')

    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
