# 🎵 Moodify

> A mood-driven music player that detects your facial expression in real time and plays a playlist that matches how you feel.

---

## 📖 About

Moodify uses your camera to analyze your facial expression and instantly curates a playlist tailored to your current mood. No searching, no selecting — just open the app, look at the camera, and let the music find you.

Built as a personal portfolio project to explore the intersection of computer vision, music, and full-stack web development.

---

## ✨ Features

- 🎭 **Real-time face detection** — detects your mood live through your camera using MediaPipe Task Vision
- 🎵 **Mood-based playlist** — fetches a curated list of songs from the database matching your detected mood
- 🎛️ **Full-featured MP3 player** — play/pause, previous, repeat (none / all / one), and volume control
- 📋 **Playlist drawer** — slide-up panel listing all songs for the current mood, with an animated equaliser for the active track
- 🔐 **Authentication** — Login and Register UI with secure JWT-based auth and token blacklisting on logout
- ☁️ **Cloud media storage** — songs and cover art uploaded and served via ImageKit

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React | UI & component architecture |
| SCSS | Component-level styling |
| MediaPipe Task Vision | In-browser real-time face detection & expression analysis |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & data modelling |
| ImageKit | Song & media file uploads and streaming |
| Redis | JWT token blacklisting for secure logout |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Redis instance (local or managed e.g. Redis Cloud, Upstash)
- ImageKit account
- npm or yarn

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/your-username/moodify.git
cd moodify
```

**2. Install dependencies**
```bash
# Backend
cd Backend
npm install

# Frontend
cd ../Frontend
npm install
```

**3. Set up environment variables**

Create a `.env` file in the `Backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
IMAGE_KIT_KEY=your_imagekit_private_key
```

Create a `.env` file in the `Frontend/` directory:
```env
VITE_API_BASE_URL=http://localhost:8080
```

**4. Run the app**
```bash
# Start backend (from /Backend)
npm run dev

# Start frontend (from /Frontend)
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/songs/playlist?mood=happy&limit=10` | Fetch playlist by mood |
| `GET` | `/api/songs?mood=happy` | Fetch a single song by mood |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `POST` | `/api/auth/logout` | Logout and blacklist token via Redis |

---

## 🧠 How It Works

```
1. Camera feed opens on page load
2. MediaPipe Task Vision scans for facial expressions when you click button 
3. Dominant expression is extracted (happy, sad, surprised etc.)
4. Mood is sent to the backend API
5. Backend queries MongoDB for songs tagged with that mood
6. Song files are streamed from ImageKit CDN
7. Frontend receives the playlist and begins playback
8. Playlist drawer lets the user browse and select any song in the mood list
9. On logout, JWT is blacklisted in Redis to prevent reuse
```

---

## 🗺️ Future Enhancements
- [ ] User history — tracks moods and songs listened to over time
- [ ] Manual mood override — pick your mood from a list
- [ ] Mobile responsive layout
- [ ] Dark / light theme toggle
