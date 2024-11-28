import json
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://anitube.in.ua/anime/page/{}/"
OUTPUT_FILE = "anime_data.json"

def parse_rating(rating_style):
    """
    Extracts rating value from 'width: XXXpx' style attribute.
    """
    try:
        width_value = float(rating_style.split(":")[1].split("px")[0].strip())
        return round(width_value / 20, 1)  # Convert to scale of 0-10
    except Exception:
        return None

def parse_page(page_num):
    """
    Parse a single page and return a list of anime entries.
    """
    url = BASE_URL.format(page_num)
    response = requests.get(url)
    if response.status_code == 404:
        return None  # Stop parsing if page not found

    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    articles = soup.find_all("article", class_="story")
    anime_list = []

    for article in articles:
        try:
            # Title
            title_element = article.find("h2", itemprop="name").a
            title = title_element.text.strip()
            link = title_element["href"]

            # Image
            img_element = article.find("div", class_="story_c_l").find("img")
            image_url = img_element["src"] if img_element and img_element.get("src") else "No image"
            if not image_url.startswith("http"):  # Handle relative URLs
                image_url = f"https://anitube.in.ua{image_url}"

            # Series info
            series_info_element = article.find("dt", string="Серій:")
            series_info = series_info_element.next_sibling.strip() if series_info_element else "Unknown"

            # Categories
            categories_element = article.find("dt", string="Категорія:")
            categories = (
                [cat.strip() for cat in categories_element.next_sibling.split(",")]
                if categories_element
                else []
            )

            # Year
            year_element = article.find("dt", string="Рік виходу аніме:")
            year = year_element.find_next("a").text.strip() if year_element else "Unknown"

            # Translators
            translators_element = article.find("dt", string="Переклад:")
            translators = (
                [translator.text.strip() for translator in translators_element.find_all("a")]
                if translators_element
                else []
            )

            # Voice actors
            voices_element = article.find("dt", string="Ролі озвучували:")
            voice_actors = (
                [actor.text.strip() for actor in voices_element.find_all("a")]
                if voices_element
                else []
            )

            # Rating
            rating_element = article.find("div", class_="starbar_w")
            rating_style = rating_element["style"] if rating_element else ""
            rating = parse_rating(rating_style)

            # Summary
            summary_element = article.find("div", class_="story_c_text")
            summary = summary_element.text.strip() if summary_element else "No summary available."

            # Append the data
            anime_list.append({
                "title": title,
                "link": link,
                "image_url": image_url,
                "series_info": series_info,
                "categories": categories,
                "year": year,
                "translators": translators,
                "voice_actors": voice_actors,
                "rating": rating,
                "summary": summary,
            })

        except Exception as e:
            print(f"Error parsing article: {e}")

    return anime_list

def main():
    all_anime = []
    page_num = 1

    while True:
        print(f"Parsing page {page_num}...")
        anime = parse_page(page_num)

        if anime is None:  # Stop if the page does not exist
            print("No more pages to parse. Stopping...")
            break

        all_anime.extend(anime)
        page_num += 1

    print(f"Parsed {len(all_anime)} anime entries. Saving to '{OUTPUT_FILE}'.")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(all_anime, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    main()

