# DeepSeek-R1-Distill-Qwen:7B on reComputer Jetson

## Introduction

DeepSeek-R1-Distill-Qwen:7B-W4A16-G128 on **reComputer Jetson** platforms (e.g., J401, Orin). This guide covers deployment on NVIDIA Jetson-based reComputer boards.

## Quick Start

### Install Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
```

### Run on reComputer Jetson

```docker
sudo docker run -it --rm --pull always --runtime=nvidia \
  --network host ghcr.io/seeed-studio/vllm:latest-jetson-orin \
  vllm serve <model-path>
```

## API Test

Use the REST API at `http://localhost:8080/v1/chat/completions` for inference on reComputer Jetson devices.
