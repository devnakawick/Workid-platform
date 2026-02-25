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
        "water", "bathroom", "kitchen", "geyser", "pump"
    ],
    "electrical": [
        "electrician", "wiring", "electric", "light", "bulb", "switch", 
        "socket", "power", "circuit", "fuse", "meter", "fan"
    ],
    "carpentry": [
        "carpenter", "wood", "furniture", "door", "window", "table", 
        "chair", "shelf", "cabinet", "cupboard", "wardrobe"
    ],
    "masonry": [
        "mason", "brick", "cement", "concrete", "wall", "tile", 
        "floor", "plastering", "construction", "building"
    ],
    "painting": [
        "painter", "paint", "wall", "color", "brush", "ceiling",
        "interior", "exterior", "decorator", "whitewash"
    ],
    "gardening": [
        "gardener", "garden", "lawn", "plant", "tree", "grass",
        "landscape", "pruning", "hedge", "flower"
    ],
    "cleaning": [
        "cleaner", "cleaning", "sweep", "mop", "vacuum", "wash",
        "housekeeping", "janitor", "sanitize", "disinfect"
    ],
    "driving": [
        "driver", "driving", "vehicle", "car", "van", "lorry",
        "transport", "delivery", "chauffeur"
    ],
    "general_labor": [
        "labor", "labourer", "helper", "assistant", "worker",
        "manual", "loading", "unloading", "moving"
    ]
}

# ======= Span Detection =======

# Keywords that indicate spam/scam
SPAM_KEYWORDS = [
    "earn money fast", "work from home guaranteed", "no experience needed", 
    "earn lakhs", "deposit required", "pay first", "register now", 
    "limited offer", "act now", "guaranteed income", "mlm", "pyramid" 
]

# Minimum job description length 
MIN_DESCRIPTION_LENGTH = 20

# Maximum reasonable budget
MAX_REASONABLE_BUDGET = 100000

# ======= Fraud Detection =======

# Anomaly detection thresholds
MAX_JOBS_PER_DAY = 10   # Employer posting more = suspicious
MAX_APPLICATIONS_PER_DAY = 50   # Worker applying to 50+ = suspicious

# Minimum time between applications (seconds)
MIN_APPLICATION_INTERVAL = 10   # Applying every 5 seconds = bot

# ======= Content Moderation =======

# Inappropriate words to filter
INAPPROPRIATE_KEYWORDS = [
    "offensive_word1", "offensive_word2", "offensive_word3", 
    "offensive_word4", "offensive_word5"    # Add later
]

# ======= Search Parsing =======

# Sri Lankan cities for location parsing
SRI_LANKAN_CITIES = [
    "colombo", "galle", "kandy", "jaffna", "negombo",
    "baticaloa", "trincomalee", "matara", "anuradhapura", 
    "kurunegala", "ratnapura", "badulla", "ampara", 
    "hambantota", "vavuniya", "gampaha", "kalutara"
]

# Budget-related keywords
BUDGET_KEYWORDS = {
    "cheap": {"max_multiplier": 0.7},   # 30% below average
    "low": {"max_multiplier": 0.8},  
    "expensive": {"min_multiplier": 1.3},
    "high": {"min_multiplier": 1.2}
}

# Urgency keywords
URGENCY_KEYWORDS = {
    "urgent": "high",
    "emergency": "high",
    "asap": "high",
    "today": "high", 
    "immediately": "high",
    "soon": "medium",
    "whenever": "low",
    "flexible": "low"
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