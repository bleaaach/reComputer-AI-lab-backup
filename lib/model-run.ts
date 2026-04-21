/**
 * Shared helpers for Run modal and model detail page: device list, engine list per device, docker command.
 */
import type { Model } from "./types";
import { DEFAULT_DEVICES, DEFAULT_ENGINES } from "./models-data.generated";
import { generateDockerCommand } from "./run-command";

export function getDevices(model: Model | null) {
  if (!model) return [...DEFAULT_DEVICES];
  return model.devices?.length ? model.devices : [...DEFAULT_DEVICES];
}

export function getEnginesForDevice(model: Model | null, deviceId: string) {
  if (!model) return [...DEFAULT_ENGINES];
  const perDevice = model.deviceEngines?.[deviceId];
  if (perDevice?.length) return perDevice;
  return model.engines?.length ? model.engines : [...DEFAULT_ENGINES];
}

/** Resolve display label for an engine id (e.g. for Benchmark dropdown). */
export function getEngineLabel(model: Model | null, engineId: string): string {
  if (engineId === "default") return "Default";
  if (model?.deviceEngines) {
    for (const list of Object.values(model.deviceEngines)) {
      const found = list.find((e) => e.id === engineId);
      if (found) return found.label;
    }
  }
  if (model?.engines?.length) {
    const found = model.engines.find((e) => e.id === engineId);
    if (found) return found.label;
  }
  const fromDefaults = DEFAULT_ENGINES.find((e) => e.id === engineId);
  return fromDefaults?.label ?? engineId;
}

export function getDockerCommand(
  model: Model | null,
  deviceId: string,
  engineId: string
): string {
  if (!model) return "";
  const fromModel = model.dockerCommands?.find(
    (d) => d.deviceId === deviceId && d.engineId === engineId
  );
  if (fromModel?.command) return fromModel.command;
  return generateDockerCommand(
    model.slug,
    model.name,
    deviceId as "jetson-orin" | "jetson-nano" | "rk3588" | "recomputer-j401" | "recomputer-r01",
    engineId as "vllm" | "ollama" | "tensorrt"
  );
}
