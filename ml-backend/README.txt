# Skin Disease Classifier - Backend Setup Guide

## 1. Setup Environment
python -m venv venv
venv\Scripts\activate     (on Windows)
# OR
source venv/bin/activate  (on Mac/Linux)

## 2. Install Dependencies
pip install -r requirements.txt

## 3. Run the Server
python app.py

## 4. Test the API
Open your browser or Postman:
URL → http://127.0.0.1:5000/

You should see:
{
  "status": "ok",
  "message": "Skin Disease Classifier API running"
}

## 5. Make a Prediction
Send a POST request to:
http://127.0.0.1:5000/predict

Form-Data → key: file, value: (upload any skin image)

Example Response:
{
  "predicted_class": "Melanoma",
  "confidence": 92.47
}

## Notes
- Model input is 224x224 RGB images.
- The API automatically preprocesses and resizes inputs.
- The dataset is NOT needed for predictions.
- Frontend can send form-data (key: "file") directly to /predict.

