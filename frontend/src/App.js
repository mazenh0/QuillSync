import React, { useState, useEffect, useRef } from 'react';
import { Users, Wifi, WifiOff, MessageSquare } from 'lucide-react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [content, setContent] = useState('');
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [newComment, setNewComment] = useState('');
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

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'edit',
        content: newContent,
        cursor: e.target.selectionStart
      }));
    }
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'comment',
        text: newComment
      }));
    }

    setNewComment('');
    setShowCommentBox(false);
  };

  const deleteComment = (id) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'delete_comment',
        commentId: id
      }));
    }
  };

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
          setComments(message.comments);
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
          
        case 'edit':
          if (message.userId !== userIdRef.current) {
            setContent(message.content);
          }
          break;
          
        case 'comment':
          setComments(prev => [...prev, message.comment]);
          break;
          
        case 'delete_comment':
          setComments(prev => prev.filter(c => c.id !== message.commentId));
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
            <button
              onClick={() => setShowCommentBox(!showCommentBox)}
              className="comment-button"
            >
              <MessageSquare size={16} />
              <span>Add Comment</span>
            </button>
          </div>
          
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Start typing... your changes will sync in real-time!"
            className="editor"
          />
          
          {showCommentBox && (
            <div className="comment-box">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="comment-input"
                rows="3"
              />
              <div className="comment-actions">
                <button
                  onClick={() => setShowCommentBox(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  onClick={addComment}
                  className="post-button"
                >
                  Post Comment
                </button>
              </div>
            </div>
          )}
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

          <div className="panel">
            <h3 className="comments-header">
              <MessageSquare size={18} />
              <span>Comments ({comments.length})</span>
            </h3>
            
            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="no-comments">No comments yet</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-item" style={{ borderLeftColor: comment.color }}>
                    <div className="comment-header">
                      <span className="comment-author">{comment.author}</span>
                      <span className="comment-time">{comment.timestamp}</span>
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="delete-button"
                      >
                        ×
                      </button>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;