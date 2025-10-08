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

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` and add your configuration values.

4. Start the development server:

**Web:**
```bash
npm run dev
# or
yarn dev
```

**Mobile (React Native):**
```bash
# iOS
npm run ios
# or
yarn ios

# Android
npm run android
# or
yarn android
```

## Project Structure

```
QuillSync/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # API and service functions
│   ├── utils/          # Helper functions
│   └── config/         # Configuration files
├── server/             # Backend server code
├── mobile/             # React Native mobile app
├── public/             # Static assets
└── tests/              # Test files
```

## Usage

1. **Create a Document**: Click "New Document" to start a new collaborative document
2. **Share**: Copy the document link and share it with collaborators
3. **Edit Together**: Multiple users can edit simultaneously in real-time
4. **Save Automatically**: Changes are saved automatically as you type

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=3000
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

