
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import traceback

from model_loader import load_model
from gradcam_utils import generate_gradcam_heatmap

# Use safe path
MODEL_PATH = os.path.abspath("C:/Users/Ekaansh/OneDrive/Desktop/AB/vs code/JS/projects/satelite/test 2/eurosat_resnet18.pth")

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
