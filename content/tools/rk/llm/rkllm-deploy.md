# RKLLM Model Deploy tool

This document will introduce how to use the pre-built image to deploy your own LLM model.

## Install docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh 
```

## Prepare Your Model

### For reComputer RK3576

Here, I download the model that already converted for reComputer RK3576 as an example.
```bash
cd ~
mkdir models && cd models
wget https://huggingface.co/JiahaoLi/Qwen3-RK3576/resolve/main/Qwen3-0.6B-rk3576-w4a16.rkllm
```

### For reComputer RK3588
Here, I download the model that already converted for reComputer RK3588 as an example.

```bash
cd ~
mkdir models && cd models
wget https://huggingface.co/JiahaoLi/Qwen3-RK3588/resolve/main/Qwen3-0.6B-rk3588-w8a8.rkllm
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
  python3 /app/fastapi_server_llm.py --rkllm_model_path /models/Qwen3-0.6B-rk3576-w4a16.rkllm--target_platform rk3576 --port 8001


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
  python3 /app/fastapi_server_llm.py --rkllm_model_path /models/Qwen3-0.6B-rk3588-w8a8.rkllm --target_platform rk3588 --port 8001

```