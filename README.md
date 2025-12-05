# 🤖 Gemini AI Chatbot

A simple yet powerful chatbot web application built with **Node.js + Express** (backend) and **Vanilla JavaScript** (frontend), powered by **Google Gemini AI**.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

## ✨ Features

- 💬 Real-time chat interface with Google Gemini AI
- 🧠 Conversation history for contextual responses
- 📝 Markdown rendering support:
  - **Bold text** (`**text**`)
  - *Italic text* (`*text*`)
  - `Inline code` (`` `code` ``)
  - Headings (`#`, `##`, `###`)
  - Bullet points (`* item`)
- 🔄 Loading indicator while waiting for AI response
- ⚠️ Error handling with user-friendly messages
- 🎨 Clean and responsive UI

## 📁 Project Structure

```
gemini-chatbot-api/
├── public/
│   ├── index.html      # Frontend HTML
│   ├── style.css       # Styles
│   └── script.js       # Frontend JavaScript
├── index.js            # Express server & API
├── .env                # Environment variables (not in repo)
├── .env.example        # Example environment file
├── package.json        # Dependencies
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Google AI API Key](https://aistudio.google.com/apikey)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/z0zero/gemini-chatbot-api.git
   cd gemini-chatbot-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   API_KEY=your_google_gemini_api_key_here
   PORT=3000
   ```

   > 💡 Get your API key from [Google AI Studio](https://aistudio.google.com/apikey)

4. **Start the server**

   ```bash
   node index.js
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔌 API Reference

### POST `/api/chat`

Send a message to the Gemini AI chatbot.

**Request Body:**

```json
{
  "conversation": [
    { "role": "user", "content": "Hello, who are you?" },
    { "role": "model", "content": "I am Gemini, a large language model..." },
    { "role": "user", "content": "What can you do?" }
  ]
}
```

**Response:**

```json
{
  "result": "I can help you with a wide variety of tasks..."
}
```

**Error Response:**

```json
{
  "error": "Error message here"
}
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Node.js, Express.js |
| **Frontend** | HTML, CSS, Vanilla JavaScript |
| **AI Model** | Google Gemini 2.5 Flash |
| **API Client** | @google/genai |

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_KEY` | Your Google Gemini API key | Required |
| `PORT` | Server port number | `3000` |

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [Google Gemini AI](https://deepmind.google/technologies/gemini/) for the powerful AI model
- [Express.js](https://expressjs.com/) for the web framework

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/z0zero">z0zero</a>
</p>
