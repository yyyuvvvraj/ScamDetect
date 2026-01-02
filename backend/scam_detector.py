import os
import joblib
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "scam_model.pkl")

pipeline = joblib.load(MODEL_PATH)

vectorizer = pipeline.named_steps["tfidf"]
classifier = pipeline.named_steps["clf"]

def analyze_message(text: str):
    X = vectorizer.transform([text])
    proba = classifier.predict_proba(X)[0][1]
    label = "Scam" if proba >= 0.5 else "Safe"

    # Explainability: top contributing words
    feature_names = np.array(vectorizer.get_feature_names_out())
    coefs = classifier.coef_[0]

    contribution = X.toarray()[0] * coefs
    top_indices = np.argsort(contribution)[-5:][::-1]

    keywords = feature_names[top_indices].tolist()

    return {
        "label": label,
        "risk_score": int(proba * 100),
        "confidence": round(proba, 3),
        "matched_keywords": keywords
    }
