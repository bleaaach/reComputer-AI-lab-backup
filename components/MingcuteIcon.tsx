"use client";

import { Icon, addIcon } from "@iconify/react/dist/offline";
import { mingcuteOfflineIcons } from "@/lib/mingcute-offline-icons";

let registered = false;

function registerOnce() {
  if (registered) return;
  registered = true;
  for (const [name, data] of Object.entries(mingcuteOfflineIcons)) {
    addIcon(name, data);
  }
}

export default function MingcuteIcon(props: React.ComponentProps<typeof Icon>) {
  registerOnce();
  return <Icon {...props} />;
}

