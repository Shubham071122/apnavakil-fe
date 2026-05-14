# ApnaVakil AI — Frontend

ApnaVakil is a premium, AI-powered Legal Assistant designed to provide high-quality legal advice based on Indian Law. The frontend is built with modern web technologies, focusing on a "Quiet Luxury" aesthetic (Dark mode with Gold accents) and a seamless, real-time user experience.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Custom Dark/Gold theme)
- **Real-time Communication**: Socket.io-client (WebSockets)
- **Markdown Rendering**: `marked` (for parsing structured legal analysis)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Animations**: Framer Motion

## ✨ Key Features

- **Multi-Modal Interaction**: Support for both text-based chat and real-time voice queries.
- **Dynamic Legal Analysis**: Renders complex legal documents, precedents, and bulleted analysis using a custom markdown implementation.
- **Live WebSocket Connection**: Ensures low-latency, real-time responses from the AI orchestrator.
- **Voice Capabilities**: 
  - Records voice input from the browser.
  - Receives and plays synthesized voice (TTS) responses from the backend.
- **Premium UI/UX**: "Quiet Luxury" design system with fluid animations, glassmorphism, and responsive layouts.

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- `pnpm` package manager

### Installation

1. Clone the repository and install dependencies:
```bash
pnpm install
```

2. Set up your environment variables by creating a `.env.local` file (if necessary).

3. Run the development server:
```bash
pnpm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🔗 Related Repositories

This frontend application is designed to work in tandem with the **ApnaVakil Backend** (`apnavakil-be`), which handles:
- AI Orchestration (Gemini 2.5 Flash)
- RAG (Retrieval-Augmented Generation) for Indian Law
- STT (HuggingFace Whisper) & TTS (ElevenLabs)
- WebSocket Gateway

Make sure the backend server is running concurrently (usually on port `8080`) for the chat functionality to work.

## 🎨 Design System

The application uses a strict color palette to maintain its premium feel:
- **Background**: `#020617` (Deep Slate)
- **Accents**: `#B89B5E` (Muted Gold)
- **Text**: `text-slate-300` / `text-white`
- **Typography**: Clean sans-serif fonts with distinct markdown styling for legal headings and citations.

---
*Built with Next.js and designed for the future of legal tech.*
