# OpenCV

## Introduction
OpenCV (Open Source Computer Vision Library) is an open-source computer vision and machine learning software library. It contains more than 2500 optimized algorithms, widely used for image processing, face recognition, object detection, and robotic vision.

## Installation Steps
On Linux systems (such as reComputer RK3576), it is recommended to install via the Python package manager pip.
### Update System Packages
Before installing any new software, ensure your system package list is up to date:
```bash
sudo apt update
```

### Install OpenCV
Since modern Linux distributions restrict global pip installs to protect the system, you can use the following command to force the installation:
```bash
pip3 install --break-system-packages opencv-python
```
- **Note:** While virtual environments (venv) are recommended for production, the command above is the most direct way for rapid testing on embedded devices.

## Verification
After installation, run the following command to verify if OpenCV is installed correctly and check its version:
```bash
python3 -c "import cv2; print(cv2.__version__)"
```
If the terminal returns a version number (e.g., 4.10.0), the installation was successful.

## Quick Start Example
You can create a simple Python script to test image reading functionality:
```python
import cv2

# Create a black image
img = cv2.imread('test.jpg') 

if img is None:
    print("Check if the image path is correct!")
else:
    print("Image loaded successfully!")
```
