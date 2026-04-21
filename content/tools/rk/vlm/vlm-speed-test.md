# LLM Speed Test

This document introduces how to use the speed testing tool to test the speed of large language models.

## Install Docker
  ```bash
  curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh 
  ```
## Run on reComputer RK3576

  ```bash
      sudo docker run -it --name --privileged \
        --net=host \
        --device /dev/dri \
        --device /dev/dma_heap \
        --device /dev/rknpu \
        --device /dev/mali0 \
        -v /dev:/dev \
        ghcr.io/seeed-projects/rk3576-qwen2.5-vl:3b-w4a16-latest
  ```

## Run on reComputer RK3588

  ```bash
      sudo docker run -it --name --privileged \
        --net=host \
        --device /dev/dri \
        --device /dev/dma_heap \
        --device /dev/rknpu \
        --device /dev/mali0 \
        -v /dev:/dev \
        ghcr.io/seeed-projects/rk3588-qwen2.5-vl:3b-w8a8-latest
  ```
## Install Tools

```bash
wget https://github.com/Seeed-Projects/reComputer-RK-LLM/raw/refs/heads/main/tools/vlm_speed_test.py
```

## Create Environment

```bash
python -m venv .env && source .enb/bin/activate
pip install requests numpy
```

## Test Speed

```bash
python vlm_speed_test.py
```
