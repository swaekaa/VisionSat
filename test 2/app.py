
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import traceback

from model_loader import load_model
from gradcam_utils import generate_gradcam_heatmap

# Use safe path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "eurosat_resnet18.pth")

app = Flask(__name__)
CORS(app, origins=["http://localhost:8080"])

# Load model once at startup, get device
model, device = load_model(MODEL_PATH)

@app.route('/gradcam', methods=['POST'])
def gradcam_endpoint():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({"error": "No image selected"}), 400

        # Generate Grad-CAM heatmap as base64 string
        img_base64 = generate_gradcam_heatmap(model, image_file, device)
        return jsonify({"heatmap": img_base64})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict_endpoint():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({"error": "No image selected"}), 400

        # ======== Preprocess image ========
        from PIL import Image
        import torchvision.transforms as transforms
        image = Image.open(image_file).convert("RGB")
        transform = transforms.Compose([
            transforms.Resize((64, 64)),   # match training size
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.344, 0.380, 0.408],  # updated mean
                std=[0.176, 0.176, 0.177]    # updated std
            )
        ])
        input_tensor = transform(image).unsqueeze(0)

        # ======== Predict ========
        import torch
        with torch.no_grad():
            outputs = model(input_tensor)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)

        # ======== Prepare top 3 predictions ========
        class_names = [
            "AnnualCrop", "Forest", "HerbaceousVegetation", "Highway", "Industrial",
            "Pasture", "PermanentCrop", "Residential", "River", "SeaLake"
        ]
        top3_probs, top3_idx = torch.topk(probabilities, 3)
        predictions = [
            {"class": class_names[top3_idx[i].item()],
             "confidence": top3_probs[i].item()}
            for i in range(3)
        ]

        return jsonify({"predictions": predictions})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
