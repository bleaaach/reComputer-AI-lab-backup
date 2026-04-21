# CV

## Model performance benchmark(FPS)

| demo             | model_name                          | inputs_shape&nbsp;&nbsp;&nbsp;&nbsp; | dtype | RK3566<br />RK3568 | RK3562         | RK3588<br />@single_core | RK3576<br />@single_core | RV1109     | RV1126     | RK1808     |
| ---------------- | ----------------------------------- | ------------------------------------ | ----- | ------------------ | -------------- | ------------------------ | ------------------------ | ---------- | ---------- | ---------- |
| mobilenet        | mobilenetv2-12                      | [1, 3, 224, 224]        | INT8     | 180.7                 | 281.3     | 450.7          | 467.0     | 212.9      | 322.3      | 170.3      |
| resnet           | resnet50-v2-7                       | [1, 3, 224, 224]        | INT8     | 37.9                  | 54.9      | 110.1          | 99.0      | 24.4       | 36.2       | 37.1       |
| yolov5           | yolov5s_relu                        | [1, 3, 640, 640]        | INT8     | 25.5                  | 33.2      | 66.1           | 65.0      | 20.2       | 29.2       | 37.2       |
|                  | yolov5n                             | [1, 3, 640, 640]        | INT8     | 39.7                  | 47.4      | 82.5           | 112.7     | 36.3       | 53.2       | 61.2       |
|                  | yolov5s                             | [1, 3, 640, 640]        | INT8     | 19.3                  | 23.6      | 48.4           | 57.5      | 13.6       | 20.0       | 28.2       |
|                  | yolov5m                             | [1, 3, 640, 640]        | INT8     | 8.6                   | 10.8      | 20.9           | 23.7      | 5.8        | 8.5        | 13.3       |
| yolov6           | yolov6n                             | [1, 3, 640, 640]        | INT8     | 48.8                  | 56.4      | 106.4          | 109.1     | 37.8       | 56.8       | 66.8       |
|                  | yolov6s                             | [1, 3, 640, 640]        | INT8     | 15.2                  | 17.3      | 36.4           | 35.0      | 10.8       | 16.3       | 24.1       |
|                  | yolov6m                             | [1, 3, 640, 640]        | INT8     | 7.2                   | 8.6       | 17.8           | 17.4      | 5.6        | 8.3        | 11.5       |
| yolov7           | yolov7-tiny                         | [1, 3, 640, 640]        | INT8     | 27.9                  | 36.5      | 72.7           | 74.8      | 15.4       | 22.4       | 37.2       |
|                  | yolov7                              | [1, 3, 640, 640]        | INT8     | 4.6                   | 5.9       | 11.4           | 13.0      | 3.3        | 4.8        | 7.4        |
| yolov8           | yolov8n                             | [1, 3, 640, 640]        | INT8     | 34.0                  | 40.9      | 73.5           | 90.2      | 24.0       | 35.4       | 42.3       |
|                  | yolov8s                             | [1, 3, 640, 640]        | INT8     | 15.1                  | 18.4      | 38.0           | 40.8      | 8.9        | 13.1       | 19.1       |
|                  | yolov8m                             | [1, 3, 640, 640]        | INT8     | 6.5                   | 8.2       | 16.2           | 16.7      | 3.9        | 5.8        | 9.1        |
| yolov8_obb       | yolov8n-obb                         | [1, 3, 640, 640]        | INT8     | 33.9                  | 41.3      | 74.0           | 90.2      | 25.1       | 37.3       | 42.8       |
| yolov10          | yolov10n                            | [1, 3, 640, 640]        | INT8     | 20.7                  | 34.1      | 61.2           | 80.2      | /          | /          | /          |
|                  | yolov10s                            | [1, 3, 640, 640]        | INT8     | 10.3                  | 16.9      | 33.8           | 39.9      | /          | /          | /          |
| yolo11           | yolo11n                             | [1, 3, 640, 640]        | INT8     | 20.6                  | 34.0      | 60.0           | 77.9      | 11.7       | 17.0       | 17.6       |
|                  | yolo11s                             | [1, 3, 640, 640]        | INT8     | 10.2                  | 16.7      | 33.0           | 38.2      | 5.0        | 7.3        | 8.4        |
|                  | yolo11m                             | [1, 3, 640, 640]        | INT8     | 4.6                   | 6.5       | 12.7           | 14.6      | 2.8        | 4.0        | 5.1        |
| yolox            | yolox_s                             | [1, 3, 640, 640]        | INT8     | 15.2                  | 18.3      | 37.1           | 41.5      | 10.6       | 15.7       | 23.0       |
|                  | yolox_m                             | [1, 3, 640, 640]        | INT8     | 6.6                   | 8.2       | 16.0           | 17.6      | 4.6        | 6.8        | 10.7       |
| ppyoloe          | ppyoloe_s                           | [1, 3, 640, 640]        | INT8     | 17.1                   | 20.0      | 32.5           | 41.3      | 11.2       | 16.4       | 21.1       |
|                  | ppyoloe_m                           | [1, 3, 640, 640]        | INT8     | 7.8                   | 9.2       | 15.8           | 17.8      | 5.2        | 7.7        | 9.4        |
| yolo_world       | yolo_world_v2s                      | [1, 3, 640, 640]        | INT8     | 7.4                   | 9.6       | 22.1           | 22.3      | /          | /          | /          |
|                  | clip_text                           | [1, 20]                 | FP16     | 29.8                  | 67.4      | 95.8           | 63.5      | /          | /          | /          |
| yolov8_pose      | yolov8n-pose                        | [1, 3, 640, 640]        | INT8     | 22.6                  | 31.0      | 55.9           | 66.8      | /          | /          | /          |
| deeplabv3        | deeplab-v3-plus-mobilenet-v2        | [1, 513, 513, 1]        | INT8     | 10.9                  | 21.4      | 34.0           | 39.4      | 10.1       | 13.0       | 4.4        |
| yolov5_seg       | yolov5n-seg                         | [1, 3, 640, 640]        | INT8     | 32.2                  | 38.5      | 69.3           | 88.3      | 28.6       | 42.2       | 49.6       |
|                  | yolov5s-seg                         | [1, 3, 640, 640]        | INT8     | 15.0                  | 18.1      | 36.8           | 41.6      | 9.6        | 14.0       | 22.5       |
|                  | yolov5m-seg                         | [1, 3, 640, 640]        | INT8     | 6.8                   | 8.4       | 16.4           | 18.0      | 4.7        | 6.8        | 10.8       |
| yolov8_seg       | yolov8n-seg                         | [1, 3, 640, 640]        | INT8     | 27.8                  | 33.0      | 60.8           | 71.1      | 18.6       | 27.6       | 32.9       |
|                  | yolov8s-seg                         | [1, 3, 640, 640]        | INT8     | 11.7                  | 14.1      | 28.9           | 30.8      | 6.6        | 9.8        | 14.6       |
|                  | yolov8m-seg                         | [1, 3, 640, 640]        | INT8     | 5.2                   | 6.4       | 12.6           | 12.7      | 3.1        | 4.6        | 6.9        |
| ppseg            | ppseg_lite_1024x512                 | [1, 3, 512, 512]        | INT8     | 5.9                   | 13.9      | 35.7           | 33.6      | 18.4       | 27.1       | 20.9       |
| mobilesam        | mobilesam_encoder_tiny              | [1, 3, 448, 448]        | FP16     | 1.0                   | 6.6       | 10.0           | 11.9      | /          | /          | /          |
|                  | mobilesam_decoder                   | [1, 1, 112, 112]        | FP16     | 24.3                  | 69.6      | 116.4          | 108.6     | /          | /          | /          |
| RetinaFace       | RetinaFace_mobile320                | [1, 3, 320, 320]        | INT8     | 156.4                 | 300.8     | 227.2          | 470.5     | 144.8      | 212.5      | 198.5      |
|                  | RetinaFace_resnet50_320             | [1, 3, 320, 320]        | INT8     | 18.7                  | 26.9      | 49.2           | 56.6      | 14.6       | 20.8       | 24.6       |
| LPRNet           | lprnet                              | [1, 3, 24, 94]          | FP16     | 143.2                 | 420.6     | 586.4          | 647.8     | 30.6(INT8) | 47.6(INT8) | 30.1(INT8) |
| PPOCR-Det        | ppocrv4_det                         | [1, 3, 480, 480]        | INT8     | 22.1                  | 28.0      | 50.7           | 64.3      | 11.0       | 16.1       | 14.2       |
| PPOCR-Rec        | ppocrv4_rec                         | [1, 3, 48, 320]         | FP16     | 19.5                  | 54.3      | 73.9           | 96.8      | 1.0        | 1.6        | 6.7        |
| lite_transformer | lite-transformer-encoder-16         | embedding-256, token-16 | FP16     | 337.5                 | 725.8     | 867.6          | 784.1     | 22.7       | 35.4       | 98.3       |
|                  | lite-transformer-decoder-16         | embedding-256, token-16 | FP16     | 142.5                 | 252.0     | 343.8          | 272.3     | 48.0       | 65.8       | 109.9      |
| clip             | clip_images                         | [1, 3, 224, 224]        | FP16     | 2.3                   | 3.4       | 6.5            | 6.7       | /          | /          | /          |
|                  | clip_text                           | [1, 20]                 | FP16     | 29.7                  | 66.6      | 96.0           | 63.7      | /          | /          | /          |
| wav2vec2         | wav2vec2_base_960h_20s              | 20s audio               | FP16     | RTF <br>0.817   | RTF <br>0.323   | RTF <br>0.133  | RTF <br>0.073  | /        | /        | /         |
| whisper          | whisper_base_20s                    | 20s audio               | FP16     | RTF <br>1.178   | RTF <br>0.420   | RTF <br>0.215  | RTF <br>0.218  | /        | /        | /         |
| zipformer        | zipformer-bilingual-zh-en-t         | streaming audio         | FP16     | RTF <br>0.196   | RTF <br>0.116   | RTF <br>0.065  | RTF <br>0.082  | /        | /        | /         |
| yamnet           | yamnet_3s                           | 3s audio                | FP16     | RTF <br>0.013   | RTF <br>0.008   | RTF <br>0.004  | RTF <br>0.005  | /        | /        | /         |
| mms_tts          | mms_tts_eng_200                     | token-200               | FP16     | RTF <br>0.311   | RTF <br>0.138   | RTF <br>0.069  | RTF <br>0.069  | /        | /        | /         |

- This performance data are collected based on the maximum NPU frequency of each platform.
- This performance data calculate the time-consuming of model inference. Does not include the time-consuming of pre-processing and post-processing if not specified.
- `/` means currently not support.