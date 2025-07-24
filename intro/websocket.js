const jwt = require('jsonwebtoken');
const User = require('./Usermodel'); // adjust path as needed
const { WebSocketServer } = require('ws');

const connectedUsers = new Map();

function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', async (ws, req) => {
    try {
      const token = req.url.split('?token=')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id);

      if (!user) return ws.close();

      connectedUsers.set(ws, {
        userId: user._id.toString(),
        username: user.username,
        ws
      });

      console.log(`🔌 ${user.username} connected`);
      sendOnlineUsers();

      ws.on('message', async (data) => {
        try {
          const msg = JSON.parse(data.toString());

          if (msg.type === 'private' && msg.to && msg.message) {
            const [sender, recipient] = await Promise.all([
              User.findById(user._id),
              User.findById(msg.to)
            ]);

            const newMessage = {
              from: sender._id,
              to: recipient._id,
              message: msg.message,
              timestamp: new Date()
            };

            // Check if chat exists
            const senderChatExists = sender.chats.some(c => c.withUser.toString() === recipient._id.toString());
            const recipientChatExists = recipient.chats.some(c => c.withUser.toString() === sender._id.toString());

            const senderUpdate = senderChatExists
              ? {
                  updateOne: {
                    filter: { _id: sender._id, 'chats.withUser': recipient._id },
                    update: { $push: { 'chats.$.messages': newMessage } }
                  }
                }
              : {
                  updateOne: {
                    filter: { _id: sender._id },
                    update: {
                      $push: {
                        chats: {
                          withUser: recipient._id,
                          messages: [newMessage]
                        }
                      }
                    }
                  }
                };

            const recipientUpdate = recipientChatExists
              ? {
                  updateOne: {
                    filter: { _id: recipient._id, 'chats.withUser': sender._id },
                    update: { $push: { 'chats.$.messages': newMessage } }
                  }
                }
              : {
                  updateOne: {
                    filter: { _id: recipient._id },
                    update: {
                      $push: {
                        chats: {
                          withUser: sender._id,
                          messages: [newMessage]
                        }
                      }
                    }
                  }
                };

            // Perform database updates
            await Promise.all([
              User.bulkWrite([senderUpdate]),
              User.bulkWrite([recipientUpdate])
            ]);

            const privateMsg = {
              type: 'private',
              from: sender._id.toString(),
              fromUsername: sender.username,
              to: recipient._id.toString(),
              message: msg.message,
              timestamp: newMessage.timestamp
            };

            // Send message to recipient if online
            connectedUsers.forEach(userData => {
              if (userData.userId === recipient._id.toString()) {
                userData.ws.send(JSON.stringify(privateMsg));
              }
            });

            // Echo back to sender
            ws.send(JSON.stringify(privateMsg));
          }
        } catch (err) {
          console.error('WebSocket message error:', err);
        }
      });

      ws.on('close', () => {
        connectedUsers.delete(ws);
        sendOnlineUsers();
        console.log(`❌ ${user.username} disconnected`);
      });
    } catch (err) {
      console.error('WebSocket connection error:', err);
      ws.close();
    }
  });

  // Modify the sendOnlineUsers function to exclude current user
function sendOnlineUsers() {
  connectedUsers.forEach(currentUserData => {
    const onlineUsers = Array.from(connectedUsers.values())
      .filter(u => u.userId !== currentUserData.userId) // Exclude current user
      .map(u => ({
        id: u.userId,
        username: u.username
      }));

    currentUserData.ws.send(JSON.stringify({
      type: 'online_users',
      users: onlineUsers
    }));
  });
}
}

module.exports = setupWebSocket;
