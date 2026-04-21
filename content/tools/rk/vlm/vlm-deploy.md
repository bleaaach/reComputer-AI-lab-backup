# RKLLM Model Deploy tool

This document will introduce how to use the pre-built image to deploy your own VLM model.

## Install Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh 
```

## Prepare Your Model

### For reComputer RK3576

Here, I download the model that already converted for reComputer RK3576 as an example.
```bash
cd ~
mkdir models && cd models
wget https://huggingface.co/JiahaoLi/Qwen3-VL-RK3576/resolve/main/qwen3-vl-2b-instruct_w4a16_g128_rk3576.rkllm
wget https://huggingface.co/JiahaoLi/Qwen3-VL-RK3576/resolve/main/qwen3-vl-2b_vision_rk3576.rknn
```

### For reComputer RK3588
Here, I download the model that already converted for reComputer RK3588 as an example.

```bash
cd ~
mkdir models && cd models
wget https://huggingface.co/JiahaoLi/Qwen3-VL-RK3588/resolve/main/qwen3-vl-2b-instruct_w8a8_rk3588.rkllm
wget https://huggingface.co/JiahaoLi/Qwen3-VL-RK3588/resolve/main/qwen3-vl-2b_vision_rk3588.rknn
```

## Install Docker 

```bash
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh 
```
## Run Your Model

### Run on reComputer RK3576
```bash

sudo docker run -it --rm \
  --privileged --net=host \
  --device /dev/dri \
  --device /dev/dma_heap \
  --device /dev/rknpu \
  --device /dev/mali0 \
  -v /dev:/dev \
  -v /home/user/models:/models \
  ghcr.io/seeed-projects/deploy_llm:rk3576-latest \
  python3 /app/fastapi_server_vlm.py --encoder_model ./model/qwen3-vl-2b_vision_rk3576.rknn --llm_model ./model/qwen3-vl-2b-instruct_w8a8_rk3588.rkllm --target_platform rk3576 --port 8002

```
### Run on reComputer RK3588

```bash

sudo docker run -it --rm \
  --privileged --net=host \
  --device /dev/dri \
  --device /dev/dma_heap \
  --device /dev/rknpu \
  --device /dev/mali0 \
  -v /dev:/dev \
  -v /home/user/models:/models \
  ghcr.io/seeed-projects/deploy_llm:rk3588-latest \
  python3 /app/fastapi_server_vlm.py --encoder_model ./model/qwen3-vl-2b_vision_rk3588.rknn --llm_model ./model/qwen3-vl-2b-instruct_w8a8_rk3588.rkllm --target_platform rk3576 --port 8002

```