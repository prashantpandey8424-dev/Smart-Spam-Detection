from flask import Flask, render_template, request, jsonify
from pathlib import Path
import joblib, re
from train_model import train

BASE = Path(__file__).resolve().parent
MODEL_PATH = BASE / "model" / "spam_model.joblib"
app = Flask(__name__)

def get_model():
    if not MODEL_PATH.exists():
        train()
    return joblib.load(MODEL_PATH)

model = get_model()

def analyze(text):
    text = (text or "").strip()
    if not text:
        return None
    prediction = model.predict([text])[0]
    probabilities = model.predict_proba([text])[0]
    classes = list(model.classes_)
    spam_score = float(probabilities[classes.index("spam")]) * 100
    return {
        "label": prediction,
        "spam_score": round(spam_score, 1),
        "confidence": round(max(probabilities) * 100, 1),
        "words": len(text.split()),
        "risk": "High" if spam_score >= 70 else ("Medium" if spam_score >= 40 else "Low"),
    }

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or request.form
    result = analyze(data.get("message", ""))
    if result is None:
        return jsonify({"error": "Please enter a message to analyze."}), 400
    return jsonify(result)

@app.route("/health")
def health():
    return jsonify({"status": "ok", "model": "TF-IDF + Multinomial Naive Bayes"})

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
