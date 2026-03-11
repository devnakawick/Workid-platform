"""
AI Module Configuration
Stores all AI-related settings, thresholds, and constants
"""

from typing import Dict, List
import os

# ======= Language Settings =======
SUPPORTED_LANGUAGES = ["en", "si", "ta"]    # English, Sinhala, Tamil

LANGUAGE_NAMES = {
    "en": "English",
    "si": "Sinhala",
    "ta": "Tamil"
}

# ======= Skill Categories =======
SKILL_CATEGORIES = [
    "plumbing",
    "electrical",
    "carpentry",
    "masonry",
    "painting",
    "gardening",
    "cleaning",
    "driving",
    "general_labor",
    "other"
]

# Skill keywords for each category
SKILL_KEYWORDS = {
    "plumbing": [
        "plumber", "pipe", "tap", "sink", "drainage", "leak", "toilet", 
        "water", "bathroom", "kitchen", "geyser", "pump", "sewage",
        "faucet", "shower", "drain", "cistern"
    ],
    "electrical": [
        "electrician", "wiring", "electric", "light", "bulb", "switch", 
        "socket", "power", "circuit", "fuse", "meter", "fan", "ac",
        "air conditioner", "electrical", "voltage", "installation"
    ],
    "carpentry": [
        "carpenter", "wood", "furniture", "door", "window", "table", 
        "chair", "shelf", "cabinet", "cupboard", "wardrobe", "timber",
        "woodwork", "joinery"
    ],
    "masonry": [
        "mason", "brick", "cement", "concrete", "wall", "tile", 
        "floor", "plastering", "construction", "building", "stone",
        "bricklayer", "tiling"
    ],
    "painting": [
        "painter", "paint", "wall", "color", "brush", "ceiling",
        "interior", "exterior", "decorator", "whitewash", "coating",
        "spray painting"
    ],
    "gardening": [
        "gardener", "garden", "lawn", "plant", "tree", "grass",
        "landscape", "pruning", "hedge", "flower", "landscaping",
        "horticulture", "mowing"
    ],
    "cleaning": [
        "cleaner", "cleaning", "sweep", "mop", "vacuum", "wash",
        "housekeeping", "janitor", "sanitize", "disinfect", "domestic help",
        "maid", "house cleaner"
    ],
    "driving": [
        "driver", "driving", "vehicle", "car", "van", "lorry",
        "transport", "delivery", "chauffeur", "truck"
    ],
    "general_labor": [
        "labor", "labourer", "helper", "assistant", "worker",
        "manual", "loading", "unloading", "moving"
    ]
}

# ======= Spam Detection =======

# Keywords that indicate spam/scam
SPAM_KEYWORDS = [
    "earn money fast", "work from home guaranteed", "no experience needed", 
    "earn lakhs", "deposit required", "pay first", "register now", 
    "limited offer", "act now", "guaranteed income", "mlm", "pyramid",
    "earn money daily", "earn daily", "great opportunity", "start earning",
    "no skills required", "easy money", "work from home"
]

# Minimum job description length 
MIN_DESCRIPTION_LENGTH = 20

# Maximum reasonable budget
MAX_REASONABLE_BUDGET = 100000  #LKR

# ======= Fraud Detection =======

# Anomaly detection thresholds
MAX_JOBS_PER_DAY = 10   # Employer posting more = suspicious
MAX_APPLICATIONS_PER_DAY = 50   # Worker applying to 50+ = suspicious

# Minimum time between applications (seconds)
MIN_APPLICATION_INTERVAL = 10   # Applying every few seconds may indicate bot behavior

# ======= Content Moderation =======

# Inappropriate words to filter
INAPPROPRIATE_KEYWORDS = [
    "offensive_word1", "offensive_word2", "offensive_word3", 
    "offensive_word4", "offensive_word5"    # TODO:Add later
]

# ======= Sri Lankan Geaography =======

# 9 Provinces
SRI_LANKAN_PROVINCES = [
    "Western",
    "Central",
    "Southern",
    "Northern",
    "Eastern",
    "North Western",
    "North Central",
    "Uva",
    "Sabaragamuwa"
]

# 25 districts organized by province
SRI_LANKAN_DISTRICTS = {
    "Western": ["colombo", "gampaha", "kalutara"],
    "Central": ["kandy", "matale", "nuwara eliya"],
    "Southern": ["galle", "matara", "hambantota"],
    "Northern": ["jaffna", "kilinochchi", "mannar", "vavuniya", "mullaitivu"],
    "Eastern": ["trincomalee", "batticaloa", "ampara"],
    "North Western": ["kurunegala", "puttalam"],
    "North Central": ["anuradhapura", "polonnaruwa"],
    "Uva": ["badulla", "monaragala"],
    "Sabaragamuwa": ["ratnapura", "kegalle"]
}

# Fatten districts list for easy searching
ALL_DISTRICTS = {
    district
    for districts in SRI_LANKAN_DISTRICTS.values()
    for district in districts
}

# Major cities/towns
SRI_LANKAN_CITIES = {
    # Western Province
    "Colombo": {"district": "Colombo", "province": "Western"},
    "Negombo": {"district": "Gampaha", "province": "Western"},
    "Gampaha": {"district": "Gampaha", "province": "Western"},
    "Kalutara": {"district": "Kalutara", "province": "Western"},
    "Dehiwala": {"district": "Colombo", "province": "Western"},
    "Moratuwa": {"district": "Colombo", "province": "Western"},
    "Kelaniya": {"district": "Gampaha", "province": "Western"},
    "Ja-Ela": {"district": "Gampaha", "province": "Western"},
    "Panadura": {"district": "Kalutara", "province": "Western"},

    # Central Province
    "Kandy": {"district": "Kandy", "province": "Central"},
    "Matale": {"district": "Matale", "province": "Central"},
    "Nuwara Eliya": {"district": "Nuwara Eliya", "province": "Central"},
    "Dambulla": {"district": "Matale", "province": "Central"},
    "Gampola": {"district": "Kandy", "province": "Central"},

    # Southern Province
    "Galle": {"district": "Galle", "province": "Southern"},
    "Matara": {"district": "Matara", "province": "Southern"},
    "Hambantota": {"district": "Hambantota", "province": "Southern"},
    "Ambalangoda": {"district": "Galle", "province": "Southern"},
    "Tangalle": {"district": "Hambantota", "province": "Southern"},

    # Northern Province
    "Jaffna": {"district": "Jaffna", "province": "Northern"},
    "Vavuniya": {"district": "Vavuniya", "province": "Northern"},
    "Mannar": {"district": "Mannar", "province": "Northern"},

    # Eastern Province
    "Batticaloa": {"district": "Batticaloa", "province": "Eastern"},
    "Trincomalee": {"district": "Trincomalee", "province": "Eastern"},
    "Ampara": {"district": "Ampara", "province": "Eastern"},
    "Kalmunai": {"district": "Ampara", "province": "Eastern"},

    # North Western Province
    "Kurunegala": {"district": "Kurunegala", "province": "North Western"},
    "Puttalam": {"district": "Puttalam", "province": "North Western"},
    "Chilaw": {"district": "Puttalam", "province": "North Western"},

    # North Central Province
    "Anuradhapura": {"district": "Anuradhapura", "province": "North Central"},
    "Polonnaruwa": {"district": "Polonnaruwa", "province": "North Central"},

    # Uva Province
    "Badulla": {"district": "Badulla", "province": "Uva"},
    "Monaragala": {"district": "Monaragala", "province": "Uva"},
    "Bandarawela": {"district": "Badulla", "province": "Uva"},

    # Sabaragamuwa Province
    "Ratnapura": {"district": "Ratnapura", "province": "Sabaragamuwa"},
    "Kegalle": {"district": "Kegalle", "province": "Sabaragamuwa"},
    "Balangoda": {"district": "Ratnapura", "province": "Sabaragamuwa"}
} 

# ======= Search Parsing =======

# Budget-related keywords
BUDGET_KEYWORDS = {
    "cheap": {"max_multiplier": 0.7},   # 30% below average
    "low": {"max_multiplier": 0.8},  
    "affordable": {"max_multiplier": 0.85},
    "expensive": {"min_multiplier": 1.3},
    "high": {"min_multiplier": 1.2},
    "premium": {"min_multiplier": 1.5}
}

# Urgency keywords
URGENCY_KEYWORDS = {
    "urgent": "high",
    "emergency": "high",
    "asap": "high",
    "today": "high", 
    "immediately": "high",
    "now": "high",
    "soon": "medium",
    "whenever": "low",
    "flexible": "low", 
    "no rush": "low"
}

# ======= Model Paths =======

AI_MODELS_DIR = os.path.join("app", "ai", "models")

MODEL_PATHS = {
    "spam_classifier": os.path.join(AI_MODELS_DIR, "spam_classifier.pkl"),
    "fraud_detector": os.path.join(AI_MODELS_DIR, "fraud_detector.pkl"),
    "skill_tagger": os.path.join(AI_MODELS_DIR, "skill_tagger.pkl")
}

# ======= Confidence Thresholds =======

# Minimum confidence to flag as spam
SPAM_CONFIDENCE_THRESHOLD = 0.7

# Minimum confidence to flag as fraud
FRAUD_CONFIDENCE_THRESHOLD = 0.8

# Minimum match score to recommend a job
RECOMMENDATION_THRESHOLD = 0.5