# Project Astra

Project Astra is an educational, engineering-focused space mission platform that combines astronaut training, simulated mission operations, and a lunar/Mars planetary digital twin.

## Overview

The application includes:

- Astronaut Training Centre
- AI Mission Control dashboard
- Moon and Mars digital twin interfaces
- ASTRA AI assistant with local fallback mode
- Mission reports and scientific library
- Simulated telemetry, alerts, and mission event streams

## Quick start

### Windows PowerShell

```powershell
./start-project.ps1
```

### Manual

```powershell
npm install
npm run dev -- --host 0.0.0.0
```

## Environment configuration

Copy the sample environment file before running the app:

```powershell
Copy-Item .env.example .env
```

Example:

```env
VITE_AI_PROVIDER=local
VITE_AI_MODEL=fallback
```

## Build

```powershell
npm run build
```

## Testing

This project includes a basic Vitest setup for UI smoke validation. A local PowerShell execution-policy issue in this environment prevented a clean automated run from being captured here, but the app is still available and interactive through the Vite dev server.

```powershell
npm test -- --run
```

## AI assistant behavior

The ASTRA AI assistant uses a clearly labelled local fallback mode when no external AI provider is configured. It does not expose API keys in frontend code.

## Known limitations

- This is a demonstration-grade simulation, not live NASA telemetry.
- AI is local and rule-based unless an external provider is configured.
- The app is frontend-first and uses simulated data throughout.
- Persistent backend storage is not implemented beyond browser-side session state in the demo shell.

## Feature completion

- Overview dashboard: complete
- Astronaut training hub: complete
- Mission control telemetry and alerts: complete
- Digital twin with Moon/Mars selection: complete
- ASTRA AI assistant: complete
- Mission reports: complete
- Science library: complete
- Responsive navigation and aerospace-themed design: complete
