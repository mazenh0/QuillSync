// QuillSync Backend - Phase 1: Basic WebSocket Server
// This sets up a simple WebSocket server with room management

const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store active rooms
// Structure: Map { roomId: { users: [], content: '' } }
const rooms = new Map();

// Helper: Get or create a room
function getOrCreateRoom(roomId) {
  if (!rooms.has(roomId)) {
    console.log(`Creating new room: ${roomId}`);
    rooms.set(roomId, {
      id: roomId,
      users: [],
      content: '',
      createdAt: Date.now()
    });
  }
  return rooms.get(roomId);
}

// Helper: Broadcast message to all users in a room except sender
function broadcast(roomId, message, excludeWs = null) {
  const room = rooms.get(roomId);
  if (!room) return;
  
  const messageStr = JSON.stringify(message);
  
  room.users.forEach(user => {
    if (user.ws !== excludeWs && user.ws.readyState === WebSocket.OPEN) {
      user.ws.send(messageStr);
    }
  });
}

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  let currentRoom = null;
  let currentUser = null;

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('Received message:', message.type);

      switch (message.type) {
        case 'join':
          // User joining a room
          currentRoom = getOrCreateRoom(message.roomId);
          currentUser = {
            id: message.userId,
            name: message.username,
            color: message.color || '#3b82f6',
            ws: ws
          };
          
          currentRoom.users.push(currentUser);
          
          console.log(`User ${currentUser.name} joined room ${message.roomId}`);
          console.log(`Room ${message.roomId} now has ${currentRoom.users.length} users`);
          
          // Send current room state to the new user
          ws.send(JSON.stringify({
            type: 'init',
            content: currentRoom.content,
            users: currentRoom.users.map(u => ({
              id: u.id,
              name: u.name,
              color: u.color
            }))
          }));
          
          // Notify others that someone joined
          broadcast(message.roomId, {
            type: 'user_joined',
            user: { 
              id: currentUser.id, 
              name: currentUser.name, 
              color: currentUser.color 
            }
          }, ws);
          break;
        case 'edit':
          if (currentRoom) {
            currentRoom.content = message.content;
    
            // Broadcast to all other users
            broadcast(currentRoom.id, {
              type: 'edit',
              content: message.content,
              userId: currentUser.id,
              cursor: message.cursor
            }, ws);
          }
          break;
        case 'ping':
          // Keep-alive ping
          ws.send(JSON.stringify({ type: 'pong' }));
          break;

        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    
    if (currentRoom && currentUser) {
      // Remove user from room
      currentRoom.users = currentRoom.users.filter(u => u.id !== currentUser.id);
      
      console.log(`User ${currentUser.name} left room ${currentRoom.id}`);
      console.log(`Room ${currentRoom.id} now has ${currentRoom.users.length} users`);
      
      // Notify others
      broadcast(currentRoom.id, {
        type: 'user_left',
        userId: currentUser.id
      });
      
      // Clean up empty rooms after 5 minutes
      if (currentRoom.users.length === 0) {
        setTimeout(() => {
          const room = rooms.get(currentRoom.id);
          if (room && room.users.length === 0) {
            rooms.delete(currentRoom.id);
            console.log(`Room ${currentRoom.id} cleaned up (empty)`);
          }
        }, 5 * 60 * 1000);
      }
    }
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

// REST API endpoints for testing

// Health check
app.get('/health', (req, res) => {
  const totalUsers = Array.from(rooms.values())
    .reduce((sum, room) => sum + room.users.length, 0);
  
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    rooms: rooms.size,
    totalUsers: totalUsers
  });
});

// Get all rooms
app.get('/rooms', (req, res) => {
  const roomsList = Array.from(rooms.values()).map(room => ({
    id: room.id,
    userCount: room.users.length,
    users: room.users.map(u => ({ name: u.name, color: u.color }))
  }));
  
  res.json({ rooms: roomsList });
});

// Get specific room info
app.get('/room/:roomId', (req, res) => {
  const room = rooms.get(req.params.roomId);
  if (room) {
    res.json({
      id: room.id,
      users: room.users.map(u => ({ 
        id: u.id, 
        name: u.name, 
        color: u.color 
      })),
      userCount: room.users.length,
      createdAt: room.createdAt
    });
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log('=================================');
  console.log('QuillSync Server Started');
  console.log('=================================');
  console.log(`HTTP:      http://localhost:${PORT}`);
  console.log(`WebSocket: ws://localhost:${PORT}`);
  console.log(`Health:    http://localhost:${PORT}/health`);
  console.log('=================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
