# Seeed Jetson Develop Tool

An all-in-one AI development workbench for Seeed Studio reComputer J Series (NVIDIA Jetson) devices, covering everything from firmware flashing to app deployment.

- **GitHub**: [Seeed-Projects/Seeed-Jetson-DevelopTool](https://github.com/Seeed-Projects/Seeed-Jetson-DevelopTool)
- **Latest Release**: [v0.1.4](https://github.com/Seeed-Projects/Seeed-Jetson-DevelopTool/releases)

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Flash Center** | Download, verify (SHA256), and flash firmware for all Jetson series with one click |
| **Device Management** | Quick diagnostics, peripheral detection, real-time device info |
| **App Market** | Browse and install AI apps — YOLOv8, Ollama, DeepSeek, Node-RED, and more |
| **50+ Built-in Skills** | Automation covering drivers, AI deployment, and system tuning |
| **Remote Development** | SSH, VS Code Server, Jupyter Lab, VNC, AI agent install |
| **PC Network Sharing** | Share PC internet to Jetson over Ethernet with automatic proxy forwarding |
| **Jetson Init** | First-boot serial terminal wizard for quick setup |

---

## Requirements

- **Host OS**: Ubuntu 20.04 / 22.04 / 24.04 (Linux recommended for flashing)
- **Python**: 3.8+

---

## Installation

### Option 1 — pip (recommended)

```bash
pip install seeed-jetson-developer
```

Then launch:

```bash
seeed-jetson-developer
```

### Option 2 — Linux install script

```bash
wget https://github.com/Seeed-Projects/Seeed-Jetson-DevelopTool/releases/download/0.1.4/seeed-jetson-install-linux.sh
bash seeed-jetson-install-linux.sh
```

### Option 3 — Windows

Download and extract [seeed-jetson-install-windows.zip](https://github.com/Seeed-Projects/Seeed-Jetson-DevelopTool/releases/download/0.1.4/seeed-jetson-install-windows.zip), then run the installer.

---

## Downloads (v0.1.4)

| Platform | File |
|----------|------|
| Linux | [seeed-jetson-install-linux.sh](https://github.com/Seeed-Projects/Seeed-Jetson-DevelopTool/releases/download/0.1.4/seeed-jetson-install-linux.sh) |
| Windows | [seeed-jetson-install-windows.zip](https://github.com/Seeed-Projects/Seeed-Jetson-DevelopTool/releases/download/0.1.4/seeed-jetson-install-windows.zip) |
| Python Wheel | [seeed_jetson_developer-0.1.4-py3-none-any.whl](https://github.com/Seeed-Projects/Seeed-Jetson-DevelopTool/releases/download/0.1.4/seeed_jetson_developer-0.1.4-py3-none-any.whl) |

All releases: [GitHub Releases](https://github.com/Seeed-Projects/Seeed-Jetson-DevelopTool/releases)
