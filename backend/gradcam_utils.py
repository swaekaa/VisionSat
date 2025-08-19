import torch
import numpy as np
from PIL import Image
import torchvision.transforms as transforms
import cv2
import io
import base64

# ImageNet normalization values (as in notebook)
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

def generate_gradcam_heatmap(model, image_file, device):
    """
    Accepts a model, device, and an uploaded image file.
    Generates a Grad-CAM heatmap as a base64 PNG overlay using layer3 and notebook logic.
    Returns base64 PNG string.
    """
    try:
        # Preprocess image (resize, tensor, normalize)
        image = Image.open(image_file).convert('RGB')
        orig_size = image.size
        preprocess = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
        ])
        input_tensor = preprocess(image).unsqueeze(0).to(device)  # Shape: (1, C, H, W)

        # Store activations and gradients from layer3
        activations = []
        gradients = []

        def forward_hook(module, input, output):
            activations.append(output)

        def backward_hook(module, grad_in, grad_out):
            gradients.append(grad_out[0])

        handle_f = model.layer3.register_forward_hook(forward_hook)
        handle_b = model.layer3.register_backward_hook(backward_hook)

        # Forward pass
        model.zero_grad()
        output = model(input_tensor)
        pred_class = output.argmax(dim=1).item()

        # Backward pass for the predicted class
        class_score = output[0, pred_class]
        class_score.backward()

        # Remove hooks
        handle_f.remove()
        handle_b.remove()

        # Error handling for missing gradients/activations
        if not gradients or not activations:
            raise RuntimeError("Grad-CAM failed: gradients or activations are empty.")

        # Get hooked data (shape: [1, C, H, W])
        acts = activations[0].detach()
        grads = gradients[0].detach()

        # Compute weights and CAM (notebook logic)
        weights = grads.mean(dim=(2, 3), keepdim=True)
        cam = (weights * acts).sum(dim=1, keepdim=True)
        cam = torch.relu(cam)

        # Normalize CAM after ReLU
        cam = cam.squeeze().cpu().numpy()
        cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)
        cam = np.uint8(cam * 255)

        # Resize CAM to original image size
        cam_resized = cv2.resize(cam, orig_size, interpolation=cv2.INTER_LINEAR)

        # Convert heatmap to RGB using OpenCV
        heatmap = cv2.applyColorMap(cam_resized, cv2.COLORMAP_JET)
        heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

        # Overlay heatmap on original image (notebook logic)
        img_np = np.array(image)
        overlay = img_np * 0.5 + heatmap * 0.5
        overlay = np.uint8(overlay)

        # Convert overlay to base64 PNG
        overlay_img = Image.fromarray(overlay)
        buf = io.BytesIO()
        overlay_img.save(buf, format='PNG')
        buf.seek(0)
        img_bytes = buf.read()
        img_base64 = base64.b64encode(img_bytes).decode('utf-8')

        return img_base64

    except Exception as e:
        raise RuntimeError(f"Grad-CAM error: {str(e)}")
