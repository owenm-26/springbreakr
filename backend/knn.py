# knn_travel_model.py

import pandas as pd
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder

# Load data from CSV using pandas
df = pd.read_csv("PathPal/descriptions_categories.csv")
df.head()

# Extract descriptions and categories
descriptions = df["Description"].values
categories = df["Category"].values

# Encode the categories to integer labels
label_encoder = LabelEncoder()
categories_encoded = label_encoder.fit_transform(categories)

# Split data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(descriptions, categories_encoded, test_size=0.2, random_state=42)

# Define hyperparameter options. NOTE: after several testing, these are the best hyperparameters with respect to cost and improvement
n_neighbors_options = [41]
weights_options = ['distance']
metric_options = ['euclidean']

best_accuracy = 0
best_model = None
best_params = {}

# Loop through all combinations of hyperparameters
for n_neighbors in n_neighbors_options:
    for weights in weights_options:
        for metric in metric_options:
            # Create a pipeline with TF-IDF vectorizer and KNN classifier
            model = make_pipeline(
                TfidfVectorizer(),
                KNeighborsClassifier(n_neighbors=n_neighbors, weights=weights, metric=metric)
            )
            
            # Train the model
            model.fit(X_train, y_train)
            
            # Predict on the test set and calculate accuracy
            y_pred = model.predict(X_test)
            accuracy = accuracy_score(y_test, y_pred)
            
            # Print the accuracy for this set of hyperparameters
            print(f"n_neighbors: {n_neighbors}, weights: {weights}, metric: {metric} -> Accuracy: {accuracy:.4f}")
            
            # Check if this model is the best so far
            if accuracy > best_accuracy:
                best_accuracy = accuracy
                best_model = model
                best_params = {
                    "n_neighbors": n_neighbors,
                    "weights": weights,
                    "metric": metric
                }

# Save the best model and the label encoder
if best_model is not None:
    with open("best_knn_travel_model.pkl", "wb") as f:
        pickle.dump(best_model, f)
    with open("label_encoder.pkl", "wb") as f:
        pickle.dump(label_encoder, f)

print("\nBest Model Saved!")
print("Best Hyperparameters:", best_params)
print("Best Accuracy:", best_accuracy)