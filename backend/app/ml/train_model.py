import json
import joblib
import numpy as np
from datetime import datetime
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, confusion_matrix

from app.ml.dataset_generator import generate_dataset
from app.config import MODEL_DIR

def train_and_save_models():
    print("[+] Generating synthetic multi-vendor dataset...")
    dataset = generate_dataset(num_samples=750, seed=42)

    snippets = [item["snippet"] for item in dataset]
    labels_category = [item["category"] for item in dataset]
    labels_severity = [item["severity"] for item in dataset]

    # Combine category and severity into compound target label
    compound_labels = [f"{c}___{s}" for c, s in zip(labels_category, labels_severity)]

    print("[+] Fitting TF-IDF Vectorizer...")
    vectorizer = TfidfVectorizer(ngram_range=(1, 3), max_features=1000)
    X = vectorizer.fit_transform(snippets)

    X_train, X_test, y_train, y_test = train_test_split(
        X, compound_labels, test_size=0.20, random_state=42, stratify=compound_labels
    )

    print("[+] Training Random Forest Classifier...")
    clf = RandomForestClassifier(n_estimators=120, max_depth=15, random_state=42)
    clf.fit(X_train, y_train)

    # Evaluation
    y_pred = clf.predict(X_test)
    accuracy = float(accuracy_score(y_test, y_pred))
    macro_f1 = float(f1_score(y_test, y_pred, average="macro"))
    macro_precision = float(precision_score(y_test, y_pred, average="macro"))
    macro_recall = float(recall_score(y_test, y_pred, average="macro"))

    labels_unique = sorted(list(set(compound_labels)))
    cm = confusion_matrix(y_test, y_pred, labels=labels_unique).tolist()

    model_version = "v1.2.0-rf-tfidf"
    model_card = {
        "model_version": model_version,
        "model_type": "TF-IDF + Random Forest Classifier (n_estimators=120)",
        "trained_at": datetime.utcnow().isoformat(),
        "total_samples": len(dataset),
        "test_samples": len(y_test),
        "accuracy": round(accuracy, 4),
        "macro_f1": round(macro_f1, 4),
        "precision": round(macro_precision, 4),
        "recall": round(macro_recall, 4),
        "classes": labels_unique,
        "confusion_matrix": cm,
        "dataset_provenance": "Template-based synthetic mutation + verified vendor configs",
        "intended_use": "AI-assisted pattern classification for unknown network syntax",
        "confidence_threshold": 0.85
    }

    # Save artifacts
    joblib.dump(vectorizer, MODEL_DIR / "vectorizer.joblib")
    joblib.dump(clf, MODEL_DIR / "classifier.joblib")
    joblib.dump(snippets, MODEL_DIR / "vector_store.joblib")

    with open(MODEL_DIR / "model_card.json", "w") as f:
        json.dump(model_card, f, indent=2)

    print(f"[SUCCESS] Trained model version {model_version}!")
    print(f"         Accuracy: {accuracy*100:.2f}%, F1-Score: {macro_f1*100:.2f}%")
    print(f"         Artifacts saved to: {MODEL_DIR}")

    return model_card

if __name__ == "__main__":
    train_and_save_models()
