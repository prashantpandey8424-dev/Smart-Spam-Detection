from pathlib import Path
import pandas as pd
import joblib
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

BASE = Path(__file__).resolve().parent
DATA = BASE / "data" / "messages.csv"
MODEL = BASE / "model" / "spam_model.joblib"

def train():
    df = pd.read_csv(DATA).dropna()
    X_train, X_test, y_train, y_test = train_test_split(
        df["text"], df["label"], test_size=0.20, random_state=42, stratify=df["label"]
    )
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(lowercase=True, stop_words="english", ngram_range=(1, 2))),
        ("classifier", MultinomialNB(alpha=0.35))
    ])
    pipeline.fit(X_train, y_train)
    predictions = pipeline.predict(X_test)
    print(f"Validation accuracy on included sample dataset: {accuracy_score(y_test, predictions)*100:.1f}%")
    print(classification_report(y_test, predictions, zero_division=0))
    # Refit on all included examples for the app.
    pipeline.fit(df["text"], df["label"])
    MODEL.parent.mkdir(exist_ok=True)
    joblib.dump(pipeline, MODEL)
    print(f"Model saved: {MODEL}")
    return pipeline

if __name__ == "__main__":
    train()
