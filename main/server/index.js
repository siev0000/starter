const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 3000;

app.use(cors());

wss.on('connection', (ws) => {
  console.log('🟢 クライアント接続');

  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    console.log('📨 メッセージ:', msg);

    // ルーム中継・処理
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));
      }
    });
  });

  ws.on('close', () => {
    console.log('🔴 クライアント切断');
  });
});

server.listen(PORT, () => {
  console.log(`🚀 サーバー起動: http://localhost:${PORT}`);
});
