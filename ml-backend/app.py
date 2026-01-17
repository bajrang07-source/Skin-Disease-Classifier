# BACKEND 

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import json
import io

# -------------------------
# CONFIG
# -------------------------
MODEL_PATH = "ResNet50_Skin_Stage3_93acc.keras"
CLASS_NAMES_PATH = "class_names.json"

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# -------------------------
# LOAD MODEL + CLASSES
# -------------------------
print("[*] Loading model...")
from tensorflow.keras.applications.resnet50 import preprocess_input

# Load model (with preprocess_input for Lambda layer)
model = tf.keras.models.load_model(
    MODEL_PATH,
    custom_objects={"preprocess_input": preprocess_input}
)
print("[OK] Model loaded.")

# Load class names
with open(CLASS_NAMES_PATH, "r") as f:
    class_names = json.load(f)
print("[OK] Loaded class names:", class_names)


# -------------------------
# SIMPLE HEALTH CHECK
# -------------------------
@app.route("/", methods=["GET"])
def index():
    return jsonify({"status": "ok", "message": "Skin Disease Classifier API running"})


# -------------------------
# PREDICTION ENDPOINT
# -------------------------
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        # Validate file
        if not file or file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Read image bytes
        print(f"[INFO] Receiving file: {file.filename}")
        img_bytes = file.read()
        print(f"[INFO] Read {len(img_bytes)} bytes")
        
        # Open and process image
        img = Image.open(io.BytesIO(img_bytes))
        print(f"[INFO] Image opened: {img.format}, {img.size}, {img.mode}")
        
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
            print(f"[INFO] Converted to RGB")
        
        # Resize to model input size
        img = img.resize((224, 224))
        print(f"[INFO] Resized to 224x224")

        # Convert to numpy array with proper dtype
        img_array = np.array(img, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)
        print(f"[INFO] Array shape: {img_array.shape}, dtype: {img_array.dtype}")

        # Make prediction
        print("[INFO] Running model prediction...")
        preds = model.predict(img_array, verbose=0)
        pred_idx = int(np.argmax(preds[0]))
        confidence = float(preds[0][pred_idx]) * 100.0
        predicted_class = class_names[pred_idx]
        
        print(f"[SUCCESS] Prediction: {predicted_class} ({confidence:.2f}%)")

        return jsonify({
            "predicted_class": predicted_class,
            "confidence": round(confidence, 2)
        })


    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print("[ERROR] Prediction error:", e)
        print("[ERROR] Full traceback:")
        print(error_details)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
