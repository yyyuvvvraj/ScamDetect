import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib
import os

# Ensure paths work everywhere
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "spam.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model", "scam_model.pkl")

# Load dataset
df = pd.read_csv(DATA_PATH, encoding="latin-1")

# Keep only required columns
df = df[["v1", "v2"]]
df.columns = ["label", "text"]

# Convert labels to binary
df["label"] = df["label"].map({"spam": 1, "ham": 0})

# ML pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer(stop_words="english")),
    ("clf", LogisticRegression(max_iter=1000))
])

# Train model
model.fit(df["text"], df["label"])

# Create model directory if missing
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

# Save trained model
joblib.dump(model, MODEL_PATH)

print("✅ Model trained and saved at:", MODEL_PATH)
