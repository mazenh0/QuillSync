# QuillSync

**Secure Real-Time Collaboration (Mobile + Web)**

QuillSync is a modern collaborative editing platform that enables seamless real-time collaboration across web and mobile devices with a focus on security and performance.

## Features

- **Real-Time Collaboration**: Edit documents simultaneously with multiple users
- **Cross-Platform**: Works seamlessly on web browsers and mobile devices (iOS/Android)
- **Secure**: End-to-end encryption and secure data transmission
- **Rich Text Editing**: Powered by Quill.js for a superior editing experience
- **Conflict Resolution**: Intelligent handling of simultaneous edits
- **Offline Support**: Continue working even without an internet connection
- **User Presence**: See who's currently viewing or editing documents

## Tech Stack

### Frontend
- React/React Native
- Quill.js (Rich text editor)
- WebSocket (Real-time communication)

### Backend
- Node.js
- Express
- Socket.io (WebSocket server)
- Firebase/Firestore (Database)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- React Native CLI (for mobile development)
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mazenh0/QuillSync.git
cd QuillSync
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
   
**Backend:** Create a `.env` file in the `backend/` directory
```bash
cd backend
cp .env.example .env
```

**Frontend:** Edit the `.env` file in the `frontend/` directory with your configuration.

5. Start the development servers:

**Backend (Terminal 1):**
```bash
cd backend
node server.js
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000` and the backend on `http://localhost:8080` (or your configured port).

## Project Structure

```
QuillSync/
├── frontend/           # React frontend application
│   ├── src/           # Source files
│   │   ├── App.js     # Main application component
│   │   ├── App.css    # Application styles
│   │   └── index.js   # Entry point
│   ├── public/        # Static assets
│   ├── package.json   # Frontend dependencies
│   └── .env           # Frontend environment variables
├── backend/           # Node.js backend server
│   ├── server.js      # Express server and Socket.io setup
│   └── package.json   # Backend dependencies
├── .gitignore         # Git ignore rules
└── README.md          # Project documentation
```

## Usage

1. **Create a Document**: Click "New Document" to start a new collaborative document
2. **Share**: Copy the document link and share it with collaborators
3. **Edit Together**: Multiple users can edit simultaneously in real-time
4. **Save Automatically**: Changes are saved automatically as you type

## Configuration

**Backend `.env` file** (create in `backend/` directory):

```env
# Server
PORT=8080
NODE_ENV=development

# Database
DATABASE_URL=your_database_url

# Firebase
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id

# WebSocket
WS_PORT=8080
```

**Frontend `.env` file** (already exists in `frontend/` directory):

```env
REACT_APP_BACKEND_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8080
```

## API Documentation

### WebSocket Events

- `document:join` - Join a document room
- `document:leave` - Leave a document room
- `document:update` - Send document changes
- `document:sync` - Sync document state
- `user:presence` - Update user presence

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security

- All data transmission is encrypted using TLS/SSL
- Documents are stored with encryption at rest
- Authentication via secure token-based system
- Regular security audits and updates

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Quill.js](https://quilljs.com/) - Rich text editor
- [Socket.io](https://socket.io/) - Real-time communication
- [React](https://reactjs.org/) - UI framework
- [React Native](https://reactnative.dev/) - Mobile framework

## Contact

Project Link: [https://github.com/mazenh0/QuillSync](https://github.com/mazenh0/QuillSync)

## Roadmap

- [ ] Voice and video chat integration
- [ ] Document templates
- [ ] Advanced formatting options
- [ ] Export to PDF/Word
- [ ] Version history and rollback
- [ ] AI-powered writing assistance
- [ ] Team workspace management

---

