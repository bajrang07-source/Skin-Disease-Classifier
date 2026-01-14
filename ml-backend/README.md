# ML Backend - Skin Disease Classifier

## Overview
This is a Flask-based backend that uses a trained ResNet50 model to classify skin diseases.

## Model Information
- **Model**: ResNet50_Skin_Stage3_93acc.keras
- **Accuracy**: 93%
- **Input Size**: 224x224 RGB images
- **Classes**: 10 skin diseases
  1. Atopic Dermatitis
  2. Basal Cell Carcinoma
  3. Benign Keratosis
  4. Eczema
  5. Melanocytic Nevi
  6. Melanoma
  7. Psoriasis
  8. Seborrheic Keratoses
  9. Tinea Ringworm
  10. Warts Molluscum

## Setup (First Time Only)

### 1. Install Dependencies
```bash
.venv\Scripts\python.exe -m pip install -r requirements.txt
```

This will install:
- TensorFlow (deep learning framework)
- Flask (web framework)
- Flask-CORS (cross-origin support)
- Pillow (image processing)
- NumPy (numerical operations)

## Running the Server

### Option 1: Using Batch Script (Easiest)
Double-click `start-ml-backend.bat`

### Option 2: Manual
```bash
# Activate virtual environment
.venv\Scripts\activate

# Start server
python app.py
```

The server will start on **http://localhost:5000**

## API Endpoints

### 1. Health Check
```
GET http://localhost:5000/
```

Response:
```json
{
  "status": "ok",
  "message": "Skin Disease Classifier API running"
}
```

### 2. Predict
```
POST http://localhost:5000/predict
Content-Type: multipart/form-data
```

Body:
- `file`: Image file (JPG, PNG)

Response:
```json
{
  "predicted_class": "Melanoma",
  "confidence": 92.47
}
```

## Integration with Frontend

The React frontend (`Predict.tsx`) sends images to this backend:
1. User uploads image
2. Frontend sends to `http://localhost:5000/predict`
3. Model processes and returns prediction
4. Frontend displays result and saves to PHP database

## Troubleshooting

### Port 5000 Already in Use
Change the port in `app.py`:
```python
app.run(host="0.0.0.0", port=5001, debug=True)
```

Also update frontend `Predict.tsx` to use the new port.

### CORS Errors
Already handled with `flask-cors`. If issues persist, check browser console.

### Model Loading Errors
Ensure `ResNet50_Skin_Stage3_93acc.keras` and `class_names.json` are in the same directory as `app.py`.

## Notes
- Model takes ~5-10 seconds to load on startup
- First prediction may be slower (~2-3 seconds)
- Subsequent predictions are faster (~1 second)
- Images are automatically resized to 224x224
- No dataset needed for predictions
