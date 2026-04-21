/**
 * Quick Start Runner：根据 Target Environment + Inference Engine 生成 Docker 命令
 * 后续可改为后端 API 生成
 */

export const TARGET_ENVIRONMENTS = [
  { id: "jetson-orin", label: "Jetson Orin" },
  { id: "jetson-nano", label: "Jetson Orin Nano" },
  { id: "rk3588", label: "RK3588" },
  { id: "recomputer-j401", label: "reComputer J401" },
  { id: "recomputer-r01", label: "reComputer R01" },
] as const;

export const INFERENCE_ENGINES = [
  { id: "vllm", label: "VLLM" },
  { id: "ollama", label: "Ollama" },
  { id: "tensorrt", label: "TensorRT-LLM" },
] as const;

export type TargetEnvId = (typeof TARGET_ENVIRONMENTS)[number]["id"];
export type EngineId = (typeof INFERENCE_ENGINES)[number]["id"];

/** 模型 slug 到 Docker/推理常用镜像内名称的映射（示例，可扩展） */
const MODEL_SERVE_NAMES: Record<string, string> = {
  "yolo11n": "yolo11n",
  "yolo11s": "yolo11s",
  "yolo11m": "yolo11m",
  "7b-w4a16-g128": "deepseek-r1-distill-qwen/7b-w4a16-g128",
  "1.5b-w4a16": "deepseek-r1-distill-qwen/1.5b-w4a16",
  "1.5b-fp16": "deepseek-r1-distill-qwen/1.5b-fp16",
  "1.5b-w4a16-g128": "deepseek-r1-distill-qwen/1.5b-w4a16-g128",
  "3b-w4a16": "qwen2.5-vl/3b-w4a16",
};

function getServeName(modelSlug: string, modelName: string): string {
  return MODEL_SERVE_NAMES[modelSlug] ?? modelSlug ?? modelName;
}

/** 根据目标设备选择镜像 tag */
function getImageTag(target: TargetEnvId, engine: EngineId): string {
  if (engine === "vllm") {
    const m: Record<string, string> = {
      "jetson-orin": "latest-jetson-orin",
      "jetson-nano": "latest-jetson-orin-nano",
      "rk3588": "latest-rk3588",
      "recomputer-j401": "latest-jetson-orin",
      "recomputer-r01": "latest-rk3588",
    };
    return m[target] ?? "latest";
  }
  if (engine === "ollama") return "latest";
  if (engine === "tensorrt") return "latest-jetson";
  return "latest";
}

export function generateDockerCommand(
  modelSlug: string,
  modelName: string,
  targetEnv: TargetEnvId,
  engine: EngineId
): string {
  const serveName = getServeName(modelSlug, modelName);
  const imageTag = getImageTag(targetEnv, engine);

  if (engine === "vllm") {
    const image =
      targetEnv.startsWith("rk") || targetEnv === "recomputer-r01"
        ? "ghcr.io/seeed-studio/vllm"
        : "ghcr.io/nvidia-ai-iot/vllm";
    return `sudo docker run -it --rm --pull always --runtime=nvidia \\\n  --network host ${image}:${imageTag} \\\n  vllm serve ${serveName}`;
  }

  if (engine === "ollama") {
    return `sudo docker run -d --gpus all -p 11434:11434 \\\n  ollama/ollama run ${serveName}`;
  }

  if (engine === "tensorrt") {
    return `sudo docker run -it --rm --runtime=nvidia --network host \\\n  nvcr.io/nvidia/tensorrt_llm:${imageTag} \\\n  python -m tensorrt_llm.run --model ${serveName}`;
  }

  return `# Docker command for ${engine} on ${targetEnv}\nsudo docker run -it --rm \\\n  <image>:${imageTag} \\\n  <serve> ${serveName}`;
}
