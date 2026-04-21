## Quick Start

### 1. Install Docker

Run the following commands on the development board to install Docker:

```bash
# Download installation script
curl -fsSL https://get.docker.com -o get-docker.sh
# Install using Aliyun mirror source
sudo sh get-docker.sh --mirror Aliyun
# Start Docker and enable auto-start on boot
sudo systemctl enable docker
sudo systemctl start docker
```

### 2. Run the Project (One command, dual-mode preview)

This project supports previewing through a "web browser". The project can be run with a single command. Additionally, a Fast-API interface is provided to facilitate users' customized development and testing.

#### Step A: Pull Images
```bash
sudo docker pull ghcr.io/Seeed-Projects/recomputer-rk-cv/rk3588-yolov8-obb:latest
sudo docker pull ghcr.io/Seeed-Projects/recomputer-rk-cv/rk3576-yolov8-obb:latest
```

#### Step B: Run with One Click

**For RK3588:**
```bash
sudo docker run --rm --privileged --net=host \
    -e PYTHONUNBUFFERED=1 \
    -e RKNN_LOG_LEVEL=0 \
    --device /dev/video1:/dev/video1 \
    --device /dev/dri/renderD129:/dev/dri/renderD129 \
    -v /proc/device-tree/compatible:/proc/device-tree/compatible \
    ghcr.io/Seeed-Projects/recomputer-rk-cv/rk3588-yolov8-obb:latest \
    python web_detection.py --model_path model/yolov8n_obb.rknn --camera_id 1
```

**For RK3576:**
```bash
sudo docker run --rm --privileged --net=host \
    -e PYTHONUNBUFFERED=1 \
    -e RKNN_LOG_LEVEL=0 \
    --device /dev/video1:/dev/video1 \
    --device /dev/dri/renderD128:/dev/dri/renderD128 \
    -v /proc/device-tree/compatible:/proc/device-tree/compatible \
    ghcr.io/Seeed-Projects/recomputer-rk-cv/rk3576-yolov8-obb:latest \
    python web_detection.py --model_path model/yolov8n_obb.rknn --camera_id 1
```

Access via: `http://<Board_IP>:8000`

> **Note**: If you need custom classes, you can add `-v $(pwd)/class_config.txt:/app/class_config.txt \` mount and `--class_path` parameter. The program defaults to COCO 80 classes.

Example:

```bash
sudo docker run --rm --privileged --net=host \
    -e PYTHONUNBUFFERED=1 \
    -e RKNN_LOG_LEVEL=0 \
    -v $(pwd)/class_config.txt:/app/class_config.txt \
    --device /dev/video1:/dev/video1 \
    --device /dev/dri/renderD129:/dev/dri/renderD129 \
    -v /proc/device-tree/compatible:/proc/device-tree/compatible \
    ghcr.io/Seeed-Projects/recomputer-rk-cv/rk3588-yolov8-obb:latest \
    python web_detection.py --model_path model/yolov8n_obb.rknn --camera_id 1 --class_path class_config.txt
```

---

## 🔌 API Documentation

This project provides RESTful interfaces compatible with the Ultralytics Cloud API standard, supporting object detection via image uploads using HTTP POST requests.

### 1. Model Inference Interface (Predict)

**Endpoint:** `POST /api/models/yolov8n_obb/predict`

#### Request Parameters (Multipart/Form-Data):
- `file`: (Optional) Image file to be detected.
- `video`: (Optional) MP4 video file to be detected.
- `timestamp`: (Optional) Timestamp in the video file (seconds), returns detection results for the frame at that point. Default is 0.
- `realtime`: (Optional) Boolean. If `true` or if no `file`/`video` parameters are provided, returns detection results for the current camera frame.
- `conf`: (Optional) Confidence threshold for a single request, range 0.0-1.0.
- `iou`: (Optional) NMS IOU threshold for a single request, range 0.0-1.0.

#### Usage Examples:

**1. Image Detection:**
```bash
curl -X POST "http://127.0.0.1:8000/api/models/yolov8n_obb/predict" -F "file=@/home/cat/001.jpg"
```

**2. Video Specific Frame Detection:**
```bash
curl -X POST "http://127.0.0.1:8000/api/models/yolov8n_obb/predict" -F "video=@/home/cat/test.mp4" -F "timestamp=5.5"
```

**3. Get Current Camera Frame Detection:**
```bash
curl -X POST "http://127.0.0.1:8000/api/models/yolov8n_obb/predict" -F "realtime=true"  
# Or without file parameters
curl -X POST "http://127.0.0.1:8000/api/models/yolov8n_obb/predict"
```

#### Response Format (JSON):
```json
{
  "success": true,
  "source": "video frame at 5.5s",
  "predictions": [
    {
      "class": "ship",
      "confidence": 0.92,
      "obb": { "x_center": 100, "y_center": 200, "width": 300, "height": 500, "angle": 0.0 }
    }
  ],
  "image": { "width": 1280, "height": 720 }
}
```

### 2. System Configuration Interface (Config)

Used to dynamically adjust thresholds for real-time video streams and default inference.

#### Get Current Configuration
- **Endpoint:** `GET /api/config`
- **Response:** `{"obj_thresh": 0.25, "nms_thresh": 0.45}`

#### Update System Configuration
- **Endpoint:** `POST /api/config`
- **Request Body (JSON):** `{"obj_thresh": 0.3, "nms_thresh": 0.5}`
- **Response:** `{"status": "success"}`

### 3. Command Line Arguments

`web_detection.py` supports the following arguments:

| Argument | Description | Default |
| :--- | :--- | :--- |
| `--model_path` | Path to RKNN model file | (Required) |
| `--camera_id` | Camera device ID (e.g., fill 1 for `/dev/video1`) | 1 |
| `--video_path` | Path to video file (overrides camera_id if provided) | None |
| `--class_path` | Path to custom class configuration file (class_config.txt) | None (Default COCO 80) |
| `--host` | Web server listening address | `0.0.0.0` |
| `--port` | Web server port | 8000 |

#### Custom Class Configuration (class_config.txt) Format:
Name classes with double quotes, separated by commas, for example:
`"person", "bicycle", "car", "motorbike"`

---

## Real-time Video Stream Interface (Video Feed)

Get real-time MJPEG video stream with detection boxes drawn, can be directly embedded in HTML `<img>` tags.

- **Endpoint:** `GET /api/video_feed`
- **Example Usage:** `<img src="http://<Board_IP>:8000/api/video_feed">`
