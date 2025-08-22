import torch
import os
import torch.nn as nn
import torchvision.models as models

def load_model(model_path: str):
    """
    Loads a trained ResNet18 CNN model from a state_dict (.pth file).
    Forces CPU (Hugging Face Spaces does not provide GPU).
    Returns the loaded model and device.
    """
    device = torch.device("cpu")  # Always use CPU
    model_path = os.path.abspath(model_path)

    # Instantiate model architecture (must match training)
    model = models.resnet18(weights=None)
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, 10)  # Change 10 if your classes differ

    # Load state_dict on CPU
    state_dict = torch.load(model_path, map_location=device)
    model.load_state_dict(state_dict)
    model.to(device)
    model.eval()
    return model, device
