const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const rooms = new Map(); // roomId -> Set of clients

// 提供静态页面
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket 信令逻辑
wss.on('connection', function connection(ws) {
  let roomId = null;
  ws.clientId = uuidv4();
  ws.send(JSON.stringify({ type: 'welcome', clientId: ws.clientId }));

  ws.on('message', function incoming(message) {
    let msg;
    try {
      msg = JSON.parse(message);
    } catch (e) {
      return;
    }

    if (msg.type === 'join') {
      roomId = msg.room;
      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }
      rooms.get(roomId).add(ws);
      ws.roomId = roomId;
      // 通知房间内其他人有新 peer
      for (const client of rooms.get(roomId)) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'new-peer', clientId: ws.clientId }));
          ws.send(JSON.stringify({ type: 'new-peer', clientId: client.clientId }));
        }
      }
      console.log(`[${roomId}] client ${ws.clientId} joined`);
      return;
    }

    // 点对点信令消息转发
    if (msg.to) {
      // 在房间内查找目标 clientId
      if (roomId && rooms.has(roomId)) {
        for (const client of rooms.get(roomId)) {
          if (client.clientId === msg.to && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ ...msg, from: ws.clientId }));
            break;
          }
        }
      }
      return;
    }
  });

  ws.on('close', function () {
    if (roomId && rooms.has(roomId)) {
      rooms.get(roomId).delete(ws);
      console.log(`[${roomId}] client disconnected`);

      // 若房间为空，则清理并广播关闭通知
      if (rooms.get(roomId).size === 0) {
        rooms.delete(roomId);
        console.log(`[${roomId}] room cleared`);
      } else {
        // 通知其他客户端发送端已退出
        for (const client of rooms.get(roomId)) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'sender-left' }));
          }
        }
      }
    }
  });
});

// 获取活跃房间列表
app.get('/api/rooms', (req, res) => {
  const activeRooms = Array.from(rooms.entries())
    .filter(([roomId, clients]) => clients.size > 0)
    .map(([roomId]) => roomId);
  res.json({ rooms: activeRooms });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
