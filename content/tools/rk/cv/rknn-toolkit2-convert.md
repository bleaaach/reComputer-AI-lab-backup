# Quick Start Guide: RKNN Toolkit2 Installation and YOLO11 Model Conversion for reComputer RK3576/RK3588

This guide focuses on **RKNN toolkit2 installation** and **model format conversion (using YOLO11 as an example)** to help you achieve efficient, high-performance inference deployment on **reComputer RK3576/RK3588**.


## Step 1: Environment Preparation & Toolkit2 Installation

First, install the underlying system dependencies and configure a Python virtual environment to ensure isolation.

```bash
# 1. Install basic dependencies
sudo apt-get update
sudo apt-get install -y python3 python3-dev python3-pip python3-venv \
libxslt1-dev zlib1g-dev libglib2.0 libsm6 libgl1-mesa-glx libprotobuf-dev gcc

# 2. Create and activate virtual environment
cd ~
python3 -m venv rknn_env
source ~/rknn_env/bin/activate

# 3. Clone the RKNN repository
git clone https://github.com/airockchip/rknn-toolkit2.git

```

### Installing Core Packages

Install the **inference library** and **development tools** based on your needs:

* **RKNN-Toolkit-Lite2 (Inference Only):** Ideal for running inference directly on the reComputer.
```bash
cd ~/rknn-toolkit2/rknn-toolkit-lite2/packages
pip3 install rknn_toolkit_lite2-2.3.2-cp311-cp311-manylinux_2_17_aarch64.manylinux2014_aarch64.whl

```


* **RKNN-Toolkit2 (Conversion + Inference):** Required for performing model conversion on-device.
```bash
cd ~/rknn-toolkit2/rknn-toolkit2/packages/arm64
pip install rknn_toolkit2-2.3.2-cp311-cp311-manylinux_2_17_aarch64.manylinux2014_aarch64.whl

```



---

## Step 2: Model Format Conversion (YOLO11 Example)

Use the **RKNN Model Zoo** to convert a general ONNX model into a `.rknn` format optimized for the RK3576/3588.

### 1. Download the Model

```bash
cd ~/rknn_model_zoo/examples/yolo11/model
chmod +x download_model.sh
./download_model.sh

```

### 2. Execute Conversion

Specify your hardware platform (`rk3576` or `rk3588`) in the `target` parameter:

```bash
cd ~/rknn_model_zoo/examples/yolo11/python
# Core operation: Convert ONNX to RKNN
python3 convert.py ../model/yolo11n.onnx rk3576

```

---

## Step 3: Run NPU Inference Test

Once converted, call the NPU hardware acceleration to run the inference:

```bash
python3 yolo11.py --model_path ../model/yolo11.rknn --img_folder ../model --img_save --target rk3576

```

---

## Troubleshooting: Runtime Library Links

If you encounter the error `librknnrt.so: cannot open shared object file`, manually create the symbolic links for the library:

```bash
# Create symbolic links to system paths
sudo mkdir -p /usr/lib64
sudo ln -s ~/rknn-toolkit2/rknpu2/runtime/Linux/librknn_api/aarch64/librknnrt.so /usr/lib/librknnrt.so
sudo ln -s ~/rknn-toolkit2/rknpu2/runtime/Linux/librknn_api/aarch64/librknnrt.so /usr/lib64/librknnrt.so

# Refresh dynamic linker cache
sudo ldconfig

```

---

## Verify Installation

Confirm that the NPU driver and RKNN-Toolkit2 are ready:

```bash
python3 -c "from rknnlite.api import RKNNLite; rknn = RKNNLite(); ret = rknn.list_devices(); print('NPU Device Info:', ret)"

```
