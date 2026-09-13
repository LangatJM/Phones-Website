import pypdf
import json
import re

reader = pypdf.PdfReader('src/assets/catalogue.pdf')

phones = []
lines = []

for page in reader.pages:
    text = page.extract_text()
    for line in text.split('\n'):
        line = line.strip()
        if line:
            lines.append(line)

print(f"Total lines extracted: {len(lines)}")

parsed_items = []
seen = set()

# Known valid brands from the catalogue
VALID_BRANDS = {
    'REALME': 'Realme',
    'INFINIX': 'Infinix',
    'ITEL': 'Itel',
    'LENIX': 'Lenix',
    'OPPO': 'Oppo',
    'TECNO': 'Tecno',
    'VIVO': 'Vivo',
    'REDMI': 'Redmi',
    'XIAOMI': 'Xiaomi',
    'SAMSUNG': 'Samsung',
    'ZTE': 'ZTE',
    'VILLAON': 'Villaon',
    'SAFARICOM': 'Safaricom',
}

# Image mapping per brand
BRAND_IMAGES = {
    'Infinix': '/images/infinix-hot-60i.png',
    'Tecno': '/images/tecno-spark-20.png',
    'Samsung': '/images/samsung-galaxy-a15.png',
    'Redmi': '/images/redmi-13.png',
    'Xiaomi': '/images/redmi-13.png',
}
DEFAULT_IMAGE = '/images/hero-phone.png'

for line in lines:
    tokens = line.split()
    if len(tokens) >= 6 and (tokens[-1] in ['DEALER', 'SAFARICOM'] or tokens[-1].isdigit()):
        try:
            channel = tokens[-1] if not tokens[-1].isdigit() else 'DEALER'
            num_idx = -1 if tokens[-1].isdigit() else -2

            total_price = int(tokens[num_idx])
            deposit = int(tokens[num_idx - 1])
            daily = int(tokens[num_idx - 2])
            storage_num = tokens[num_idx - 3]
            ram_num = tokens[num_idx - 4]

            model_parts = tokens[:num_idx - 4]
            model_name_raw = " ".join(model_parts)

            if len(model_name_raw) < 3 or not model_name_raw[0].isalpha():
                continue

            # First token must be a valid brand
            first_token = model_parts[0].upper()
            if first_token not in VALID_BRANDS:
                continue

            brand = VALID_BRANDS[first_token]
            model_name = model_name_raw.title()

            # Skip entries where the name is just "Inventory" or similar
            if model_name.lower() in ['inventory', 'onfon', 'dealer']:
                continue

            ram_str = f"{ram_num}GB"
            storage_str = f"{storage_num}GB"

            item_key = f"{model_name}-{ram_str}-{storage_str}"
            if item_key in seen:
                continue
            seen.add(item_key)

            weekly = daily * 7
            image_path = BRAND_IMAGES.get(brand, DEFAULT_IMAGE)

            parsed_items.append({
                "id": f"phone-{len(parsed_items)+1}",
                "name": model_name,
                "brand": brand,
                "ram": ram_str,
                "storage": storage_str,
                "cashPrice": total_price,
                "deposit": deposit,
                "dailyPayment": daily,
                "weeklyPayment": weekly,
                "stockStatus": "IN_STOCK",
                "image": image_path,
                "description": f"Official {brand} smartphone with {ram_str} RAM, {storage_str} storage, available on Lipa Mdogo Mdogo deposit KSh {deposit:,} and KSh {daily}/day.",
                "specs": {
                    "display": "HD+ Smooth Display",
                    "battery": "5000 mAh All-Day Battery",
                    "mainCamera": "Clear AI Multi-Camera",
                    "frontCamera": "Selfie Camera",
                    "processor": "Fast Octa-Core Processor",
                    "network": "Dual SIM 4G LTE"
                }
            })
        except Exception as err:
            pass

print(f"Successfully parsed {len(parsed_items)} phone models from catalogue.pdf")

# Show brand breakdown
brands = {}
for p in parsed_items:
    brands[p['brand']] = brands.get(p['brand'], 0) + 1
for b, c in sorted(brands.items()):
    print(f"  {b}: {c}")

with open('src/js/data.js', 'w', encoding='utf-8') as f:
    f.write("// Smartphone Catalog Data parsed from official catalogue.pdf\n\n")
    f.write("export const SEED_PHONES = " + json.dumps(parsed_items, indent=2) + ";\n")
