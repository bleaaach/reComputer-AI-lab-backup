# reComputer RK device vlm convert

This document will introduce how to use the reComputer RK toolchain to convert your own VLM model.


## Clone GitHub repository

```bash
git clone https://github.com/airockchip/rknn-llm.git

cd rknn-llm/examples/rkllm_api_demo
```

## Install package

```bash
python -m venv .env & source .env/bin/activate
wget https://github.com/airockchip/rknn-llm/raw/refs/heads/main/rkllm-toolkit/packages/rkllm_toolkit-1.2.3-cp310-cp310-linux_x86_64.whl
pip install .rkllm-toolkit
```

## 