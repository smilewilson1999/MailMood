# 📧 MailMood - Email Emotion Intelligence

> 😊 MailMood is a Chrome extension designed to enhance emotional understanding in digital communication by detecting and highlighting emotions in email content. By identifying the emotional tone and specific triggering words or phrases in an email, the tool aims to bridge communication gaps in professional and academic settings.

## ✨ Features

### 🔍 Real-time Emotion Analysis

- Detect emotions in email content with state-of-the-art AI
- Analyze emotional context and intensity
- Identify specific text triggers for each emotion

### ✍️ Smart Draft Generation

- AI-powered email response drafts
- Context-aware suggestions
- Professional tone adaptation

### 🎨 User-Friendly Interface

- Cute and intuitive design
- Non-intrusive overlay display
- Quick copy-and-paste functionality

## 🛠️ Technology Stack

- **Frontend**: React, TailwindCSS, TypeScript
- **AI Services**:
  - Hume AI for emotion detection
  - Gemini for contextual analysis and draft generation
- **Extension**: Chrome Extensions Manifest V3
- **State Management**: Custom hooks and Context API

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/mailmood.git
   cd mailmood
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Add your API keys:

   - Get API keys from Hume AI and Google (for Gemini)
   - Add them in the extension settings

4. Build the extension:

   ```bash
   pnpm build
   ```

5. Load in Chrome:

   - Open Chrome Extensions (`chrome://extensions/`)
   - Enable Developer Mode
   - Click "Load unpacked"
   - Select the `dist` folder

## 🎮 Usage

1. **Analyze Emotions**

   - Select email text
   - Press `Alt+Q` or click analyze button to submit text
   - See emotion analysis in the overlay
   - Review emotional context and triggers

2. **Generate Response**

   - Click the mail icon in the overlay
   - Review and edit the suggested draft
   - Copy to clipboard with one click

3. **Customize Settings**

   - Set your API keys in the extension settings
   - Adjust display preferences
   - Configure hotkeys

### ⌨️ Keyboard Shortcuts

| Action           | Shortcut | Description                                  |
| ---------------- | -------- | -------------------------------------------- |
| `Toggle Display` | `Alt+A`  | Show/Hide the emotion analysis overlay       |
| `Submit Text`    | `Alt+Q`  | Analyze selected email text                  |
| `Clear Context`  | `Alt+C`  | Reset the analysis and clear current context |

> 💡 **Pro Tip**: Use keyboard shortcuts for faster workflow. You can quickly analyze text without moving your hands from the keyboard.

## 🚀 Key Features

- 🎯 Precise emotion detection
- 💡 Smart response suggestions
- 🎨 Beautiful, non-intrusive UI
- ⚡️ Fast and lightweight
- 🔒 Privacy-focused
- ⌨️ Keyboard shortcuts support

## 🏗️ Architecture

```
src/
├── components/   # React components
├── lib/          # Core libraries
│   ├── hume/     # Hume AI integration
│   └── gemini/   # Gemini integration
├── pages/        # Extension pages
└── utils/        # Utility functions
```

## 📝 License

MIT License - feel free to use and modify!

## 🤝 Contributing

Contributions are welcome!

## 💖 Credits

- Emotion detection powered by Hume AI
- Natural language processing by Google's Gemini

---

> 🎯 Enhance your email communication with AI-powered emotion detection and smart response suggestions.

<div style="position: fixed; bottom: 10px; right: 10px; font-size: 14px;">
  Made by Wilson 🧙
</div>
