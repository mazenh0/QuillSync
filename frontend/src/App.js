import React, { useState, useEffect, useRef } from 'react';
import { Users, Wifi, WifiOff } from 'lucide-react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [content, setContent] = useState('');
  const [users, setUsers] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  const wsRef = useRef(null);
  const userIdRef = useRef(Math.random().toString(36).substring(7));
  const userColorRef = useRef(`#${Math.floor(Math.random()*16777215).toString(16)}`);

  useEffect(() => {
    setRoomId(Math.random().toString(36).substring(7));
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectToRoom = () => {
    if (!username.trim()) {
      alert('Please enter your name');
      return;
    }

    setConnectionStatus('connecting');

    const ws = new WebSocket('ws://localhost:3001');
    
    ws.onopen = () => {
      console.log('Connected to server');
      setConnectionStatus('connected');
      setIsConnected(true);
      
      ws.send(JSON.stringify({
        type: 'join',
        roomId: roomId,
        userId: userIdRef.current,
        username: username,
        color: userColorRef.current
      }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'init':
          setContent(message.content);
          setUsers(message.users);
          console.log('Initialized with room state');
          break;
          
        case 'user_joined':
          setUsers(prev => [...prev, message.user]);
          console.log(`${message.user.name} joined`);
          break;
          
        case 'user_left':
          setUsers(prev => prev.filter(u => u.id !== message.userId));
          console.log('User left');
          break;
          
        default:
          console.log('Unknown message:', message);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
    };

    ws.onclose = () => {
      console.log('Disconnected from server');
      setConnectionStatus('disconnected');
      setIsConnected(false);
    };

    wsRef.current = ws;
  };

  if (!isConnected) {
    return (
      <div className="login-container">
        <div className="login-box">
          <div className="header">
            <h1>QuillSync</h1>
            <p>Real-time collaborative editing</p>
            {connectionStatus === 'error' && (
              <p className="error">Unable to connect to server. Is the backend running?</p>
            )}
          </div>
          
          <div className="form">
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                onKeyPress={(e) => e.key === 'Enter' && connectToRoom()}
              />
            </div>
            
            <div className="form-group">
              <label>Room ID</label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Room ID"
              />
              <small>Share this ID with others to collaborate</small>
            </div>
            
            <button
              onClick={connectToRoom}
              disabled={connectionStatus === 'connecting'}
              className="join-button"
            >
              {connectionStatus === 'connecting' ? 'Connecting...' : 'Join Room'}
            </button>
            
            <small className="info">
              Make sure the backend server is running on localhost:3001
            </small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header-bar">
        <div className="header-left">
          <h1>QuillSync</h1>
          <div className="status">
            {connectionStatus === 'connected' ? (
              <>
                <Wifi size={16} color="#10b981" />
                <span>Connected</span>
              </>
            ) : (
              <>
                <WifiOff size={16} color="#ef4444" />
                <span>Disconnected</span>
              </>
            )}
          </div>
        </div>
        
        <div className="header-right">
          <div className="user-count">
            <Users size={16} />
            <span>{users.length} online</span>
          </div>
          <div className="room-id">
            Room: <strong>{roomId}</strong>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="editor-panel">
          <div className="panel-header">
            <h2>Document</h2>
          </div>
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing... (sync coming in Phase 3)"
            className="editor"
          />
        </div>

        <div className="sidebar">
          <div className="panel">
            <h3>Active Users</h3>
            <div className="users-list">
              {users.map((user) => (
                <div key={user.id} className="user-item">
                  <div 
                    className="user-avatar"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.name[0].toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
