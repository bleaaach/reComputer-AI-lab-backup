# reComputer RK device llm convert

This document will introduce how to use the reComputer RK toolchain to convert your own LLM model.

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

## Insatll model
Here use deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B as an example

```bash
pip install huggingface-hub
huggingface-cli download deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B --local-dir ./DeepSeek-R1-Distill-Qwen-1.5B
```

## Convert model


```bash
cd export
python generate_data_quant.py -m /path/to/DeepSeek-R1-Distill-Qwen-1.5B
python export_rkllm.py
```

>Note: For more detail check: (rkllm)[https://github.com/airockchip/rknn-llm/tree/main/examples/rkllm_api_demo]