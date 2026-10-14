
# Tea Mixer Application

Mobile controller app for automated tea mixer machines, built with React Native and Expo. It handles hardware communication over Bluetooth Low Energy (BLE), recipe management, and chat-assisted recipe generation.

## Features

- **BLE Device Communication:** Scan, connect, and stream commands directly to compatible mixer hardware using `react-native-ble-plx`.
- **Live Brew Telemetry:** Real-time monitoring of brew progress, dispensing states, and error alerts via BLE notifications.
- **Recipe Management:** CRUD interface for custom tea formulations (stored locally via Expo SQLite) alongside preset machine recipes.
- **Hardware Profile Mapping:** Assign custom recipe configurations directly to physical hardware buttons.
- **Maintenance Routines:** Dedicated triggers for machine flush and cleaning cycles.
- **AI Recipe Assistant:** Streaming chat interface connected to an external backend for ingredient ratio suggestions.
- **Localization:** Burmese (`mm`) and English (`en`) support via `i18next`.

## Tech Stack

- **Framework:** React Native, Expo (SDK), Expo Router
- **State Management:** Zustand, Immer
- **Local Storage & DB:** Expo SQLite, Async Storage
- **Forms & Validation:** React Hook Form, Zod
- **Hardware & Network:** React Native BLE PLX, Axios
- **UI & Styling:** Tailwind CSS (via Uniwind), React Native Paper, Lucide Icons
- **Tooling & Linting:** Biome, Reactotron

## Getting Started

### Prerequisites

- Node.js >= 18
- Expo CLI (`npm install -g expo-cli`)
- Physical iOS or Android device (recommended for Bluetooth testing; BLE simulation is limited on emulators)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nainghtetlinn/expo-tea.git
cd expo-tea
```

2. Install dependencies:
```bash
npm install
```

### Environment Configuration

The AI recipe assistant relies on an external streaming backend. Please refer to the [backend repository](https://github.com/nainghtetlinn/tea-suggestion) for instructions on setting up and running the recommendation server locally.

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Set `EXPO_PUBLIC_API_URL` to point to your running server:

```bash
# Physical device on the same local network:
EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:<PORT>
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run directly on an Android device/emulator
npm run android

# Run on iOS simulator
npm run ios
```

### Code Quality

Linting and formatting are handled with Biome:

```bash
npm run check
npm run format
npm run lint
```

## Application Architecture

* **Bluetooth Service (`src/services/bluetooth/`):** Manages adapter state, discovery, connection pooling, and MTU negotiation.
* **Device Service (`src/services/device/`):** Serializes recipe payloads and parses telemetry notifications received from the microcontroller.
* **Database Layer (`src/services/database/`):** Handles offline persistence of user-created recipes using SQLite tables.
* **State Stores (`src/stores/`):** Modular Zustand stores split by domain (`bluetooth-store`, `device-store`, `tea-store`).

## Project Structure

```text
expo-tea/
├── src/
│   ├── assets/             # Fonts and static media
│   ├── components/         # Reusable UI components
│   │   ├── chat/           # AI assistant views
│   │   ├── dialogs/        # Device action modals
│   │   ├── tea-card/       # Recipe list elements
│   │   └── tea-cup/        # SVG brewing animation components
│   ├── constants/          # Predefined recipe defaults and prompts
│   ├── hooks/              # Custom layout and hardware hooks
│   ├── i18n/               # Translation files (en, mm)
│   ├── screens/            # Core views (Home, Recipes, Machine, Chat, Settings)
│   ├── services/           # BLE handlers, SQLite access, API client
│   ├── stores/             # Zustand state stores
│   └── types/              # TypeScript definitions
├── app.json                # Expo configuration
├── biome.json              # Linter/formatter settings
└── package.json
```

## Contributing

This project is currently private and not accepting external contributions.

## License

Copyright (c) 2026 Naing Htet Linn. All rights reserved.

This project and its source code are proprietary. Unauthorized copying, modification, distribution, or use of this software, in whole or in part, via any medium, is strictly prohibited without prior written permission from the author.