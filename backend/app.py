import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

try:
    client = genai.Client()
except Exception as e:
    print(f"Error initializing Gemini client: {e}")
    client = None

# Comprehensive Toyota car database
CAR_DATABASE = {
    'Camry': {
        'price': 28045,
        'year': 2025,
        'type': 'Sedan',
        'engine': '2.5L 4-Cylinder',
        'hp': 203,
        'mpg': '28/39',
        'features': ['Sunroof', 'Excellent fuel economy', 'Safe (5-star NHTSA)', 'Spacious interior', 'Comfortable seats', 'Advanced safety tech', 'Smooth ride', 'Bluetooth connectivity', 'Apple CarPlay/Android Auto'],
        'best_in_regions': ['75080', '75001', '75002', '75003', '75004'],
        'budget_min': 25000,
        'budget_max': 35000,
    },
    'RAV4': {
        'price': 30175,
        'year': 2025,
        'type': 'SUV',
        'engine': '2.5L 4-Cylinder',
        'hp': 203,
        'mpg': '28/35',
        'features': ['All-wheel drive', 'Great for families', 'High resale value', 'Versatile storage', 'Safe (5-star NHTSA)', 'Off-road capability', 'Rugged design', 'Backup camera', 'Blind spot monitoring'],
        'best_in_regions': ['90210', '90001', '90002'],
        'budget_min': 28000,
        'budget_max': 38000,
    },
    'Supra': {
        'price': 45050,
        'year': 2025,
        'type': 'Sports Car',
        'engine': '3.0L Turbo',
        'hp': 382,
        'mpg': '22/32',
        'features': ['Powerful engine (382 HP)', 'Sporty performance', 'Luxury interior', 'Eye-catching design', 'Fast acceleration (3.9s 0-60)', 'Premium sound system', 'Sleek aerodynamics', 'Sport suspension', 'Adaptive headlights'],
        'best_in_regions': ['10001', '10002', '10003'],
        'budget_min': 40000,
        'budget_max': 55000,
    },
    'Corolla': {
        'price': 23550,
        'year': 2025,
        'type': 'Compact Sedan',
        'engine': '1.8L 4-Cylinder',
        'hp': 139,
        'mpg': '30/40',
        'features': ['Excellent fuel economy', 'Affordable pricing', 'Reliable', 'Small footprint', 'Easy to park', 'Advanced safety features', 'Touchscreen display', 'USB charging ports'],
        'best_in_regions': ['60601', '60602', '75001'],
        'budget_min': 20000,
        'budget_max': 28000,
    },
    'Highlander': {
        'price': 39520,
        'year': 2025,
        'type': '3-Row SUV',
        'engine': '3.5L V6',
        'hp': 295,
        'mpg': '24/32',
        'features': ['Spacious 3-row seating', 'Perfect for large families', 'All-wheel drive', 'High towing capacity', 'Panoramic sunroof', 'Advanced safety suite', 'Power liftgate', 'Dual-zone climate control'],
        'best_in_regions': ['75080', '90210', '10001'],
        'budget_min': 36000,
        'budget_max': 48000,
    },
    'Prius': {
        'price': 26550,
        'year': 2025,
        'type': 'Hybrid Sedan',
        'engine': '1.8L Hybrid',
        'hp': 121,
        'mpg': '54/50',
        'features': ['Exceptional fuel economy (50+ MPG)', 'Eco-friendly', 'Quieter ride', 'Regenerative braking', 'Lower emissions', 'Tax incentives eligible', 'Modern design', 'Self-charging battery'],
        'best_in_regions': ['90210', '94301', '94302'],
        'budget_min': 24000,
        'budget_max': 32000,
    },
    'Tacoma': {
        'price': 32650,
        'year': 2025,
        'type': 'Pickup Truck',
        'engine': '3.5L V6',
        'hp': 278,
        'mpg': '21/25',
        'features': ['Powerful towing', 'Off-road ready', 'Bed storage', 'All-terrain capability', 'High ground clearance', 'Integrated bed lighting', 'Backup camera', 'Cruise control'],
        'best_in_regions': ['75080', '75001', '80202'],
        'budget_min': 30000,
        'budget_max': 40000,
    },
    'Sienna': {
        'price': 35740,
        'year': 2025,
        'type': 'Minivan',
        'engine': '2.5L Hybrid',
        'hp': 244,
        'mpg': '35/32',
        'features': ['3-row seating for 8', 'Sliding doors', 'All-wheel drive', 'Great fuel economy', 'Family-friendly', 'Entertainment system', 'Power windows all rows', 'Backup camera'],
        'best_in_regions': ['60601', '75001', '90210'],
        'budget_min': 33000,
        'budget_max': 42000,
    },
    '4Runner': {
        'price': 47570,
        'year': 2025,
        'type': 'Full-Size SUV',
        'engine': '4.0L V6',
        'hp': 270,
        'mpg': '18/23',
        'features': ['Legendary durability', 'Excellent towing', 'Off-road capability', 'Spacious interior', 'Full-frame construction', 'Multi-terrain select', 'Panoramic roof', 'Leather seats'],
        'best_in_regions': ['75080', '80202', '83702'],
        'budget_min': 45000,
        'budget_max': 60000,
    },
    'Venza': {
        'price': 37140,
        'year': 2025,
        'type': 'Crossover',
        'engine': '2.5L Hybrid',
        'hp': 240,
        'mpg': '38/36',
        'features': ['Sleek crossover design', 'Hybrid efficiency', 'Smooth handling', 'Premium interior', 'Panoramic sunroof', 'All-wheel drive', 'Quiet cabin', 'Tech-forward'],
        'best_in_regions': ['90210', '94301', '60601'],
        'budget_min': 35000,
        'budget_max': 45000,
    }
}

def get_zipcode_region(zipcode: str) -> str:
    """Determine region from zipcode"""
    if zipcode.startswith(('75', '76', '78', '79')):
        return 'Texas'
    elif zipcode.startswith(('90', '91', '92', '93', '94')):
        return 'California'
    elif zipcode.startswith(('10', '11', '12')):
        return 'New York'
    elif zipcode.startswith(('80', '81', '82')):
        return 'Colorado'
    elif zipcode.startswith(('83', '84')):
        return 'Mountain West'
    else:
        return 'General'

def format_car_recommendation(car_name: str, car_info: dict, is_budget_match: bool) -> str:
    """Format a single car recommendation nicely"""
    features_text = '\n• '.join(car_info['features'][:5])  # Show first 5 features
    
    recommendation = f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚗 {car_name.upper()} {car_info['year']}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Type: {car_info['type']}
💰 Price: ${car_info['price']:,}
✓ Budget Match: {'Perfect ✓' if is_budget_match else 'Close Match'}

🔧 Specifications:
- Engine: {car_info['engine']}
- Horsepower: {car_info['hp']} HP
- Fuel Economy: {car_info['mpg']} (City/Highway)

⭐ Key Features:
- {features_text}
+ {len(car_info['features']) - 5} more features available

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
    return recommendation

def recommend_cars(zipcode: str, budget: str) -> str:
    """Recommend cars based on zipcode and budget"""
    try:
        budget_num = float(budget.replace('$', '').replace(',', ''))
    except:
        return "❌ Invalid budget format. Please use format like: $25,000"
    
    region = get_zipcode_region(zipcode)
    
    # Find cars that match budget
    matching_cars = []
    for car_name, car_info in CAR_DATABASE.items():
        if car_info['budget_min'] <= budget_num <= car_info['budget_max']:
            matching_cars.append((car_name, car_info, True))
        elif abs(car_info['price'] - budget_num) < 10000:
            matching_cars.append((car_name, car_info, False))
    
    # Sort by budget match
    matching_cars.sort(key=lambda x: x[2], reverse=True)
    
    # Get top 2 recommendations
    recommendations = matching_cars[:2]
    
    if not recommendations:
        return f"❌ No cars found matching budget ${budget_num:,} in {region}. Would you like to adjust your budget?"
    
    result = f"""
🎯 PERSONALIZED RECOMMENDATIONS FOR YOU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Region: {region}
💵 Budget: {budget}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
    
    for i, (car_name, car_info, is_budget_match) in enumerate(recommendations, 1):
        result += f"\n✦ OPTION {i}" + format_car_recommendation(car_name, car_info, is_budget_match)
    
    return result

def get_all_cars_info() -> str:
    """Get information about all available Toyota models"""
    result = """
📚 ALL AVAILABLE TOYOTA MODELS 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"""
    for car_name, car_info in CAR_DATABASE.items():
        result += f"""
🚗 {car_name}
   Type: {car_info['type']} | Price: ${car_info['price']:,}
   Engine: {car_info['engine']} | HP: {car_info['hp']} | MPG: {car_info['mpg']}
   ✨ {car_info['features'][0]} | {car_info['features'][1]}

"""
    return result

SYSTEM_INSTRUCTION = (
    "You are 'Yota', a highly capable Toyota AI assistant. "
    "Your job is to recommend Toyota cars based on user's ZIP code and budget. "
    "You have access to comprehensive information about all Toyota models: Corolla, Camry, RAV4, Prius, Supra, Highlander, Sienna, Tacoma, 4Runner, and Venza. "
    "When users ask about cars, provide detailed information in a friendly, formatted manner. "
    "When users provide ZIP code and budget, get recommendations and present them clearly. "
    "Answer follow-up questions about specific features, performance, and specifications. "
    "ALWAYS end conversations by mentioning the Finance & Compare tool on the website for financing options and monthly payment calculators. "
    "Be friendly, professional, use emojis to make it engaging, and help them find their perfect Toyota match. "
    "Format your responses with line breaks and clear sections for readability. "
    "STRICTLY provide information only about Toyota models."
)

@app.route('/api/chat', methods=['POST'])
def chat():
    if not client:
        return jsonify({"text": "❌ AI service is currently unavailable."}), 503

    data = request.json
    message_history = data.get('messages', [])
    
    if not message_history:
        return jsonify({"text": "No message history provided"}), 400
    
    latest_message = message_history[-1]['text'].lower()
    
    # Check for ZIP code and budget
    import re
    has_zipcode = bool(re.search(r'\b\d{5}\b', latest_message))
    has_budget = bool(re.search(r'\$[\d,]+|budget', latest_message))
    
    context_info = ""
    
    if has_zipcode and has_budget:
        zipcode_match = re.search(r'\b\d{5}\b', latest_message)
        budget_match = re.search(r'\$[\d,]+', latest_message)
        
        if zipcode_match and budget_match:
            zipcode = zipcode_match.group()
            budget = budget_match.group()
            recommendations = recommend_cars(zipcode, budget)
            context_info = f"\n\n[RECOMMENDATIONS TO SHOW USER]:\n{recommendations}\n"
    
    # Add context about all cars if user asks about options
    if any(word in latest_message for word in ['what', 'all', 'models', 'options', 'available', 'show']):
        all_cars = get_all_cars_info()
        context_info += f"\n[ALL TOYOTA MODELS]:\n{all_cars}\n"
    
    # Add finance information
    finance_note = """
[IMPORTANT - Always mention at the end]
💳 FINANCING OPTIONS: Visit our website's "Finance & Compare" tool to:
- Calculate monthly payments instantly
- Compare any 2 models side-by-side
- Adjust down payment (5% - 50%)
- See 60-month financing at 6.5% APR
- Get pre-approval and financing quotes
"""
    context_info += f"\n{finance_note}"
    
    # Format history for Gemini
    formatted_history = []
    for msg in message_history[:-1]:
        formatted_history.append(
            types.Content(
                role="user" if msg['role'] == 'user' else "model",
                parts=[types.Part(text=msg['text'])]
            )
        )
    
    # Add latest message with context
    user_message_with_context = message_history[-1]['text'] + context_info
    formatted_history.append(
        types.Content(
            role="user",
            parts=[types.Part(text=user_message_with_context)]
        )
    )
    
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=formatted_history,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=0.7,
            )
        )
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return jsonify({"text": f"❌ Sorry, I encountered an error: {str(e)}"}), 500

    if response and response.text:
        return jsonify({"text": response.text})
    else:
        return jsonify({"text": "I couldn't generate a response. Please try again."}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)