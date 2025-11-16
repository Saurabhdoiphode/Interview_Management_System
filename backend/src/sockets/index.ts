import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyAccessToken } from '../utils/jwt';
import logger from '../utils/logger';
import config from '../config';

class SocketService {
  private io: SocketServer | null = null;
  private userSockets: Map<string, string[]> = new Map();

  initialize(httpServer: HttpServer): void {
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: config.clientUrl,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.io.use((socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }

        const decoded = verifyAccessToken(token);
        socket.data.user = decoded;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket) => {
      const userId = socket.data.user?.userId;
      
      if (userId) {
        // Store socket connection
        if (!this.userSockets.has(userId)) {
          this.userSockets.set(userId, []);
        }
        this.userSockets.get(userId)?.push(socket.id);

        logger.info(`User ${userId} connected with socket ${socket.id}`);

        socket.on('disconnect', () => {
          const sockets = this.userSockets.get(userId) || [];
          const index = sockets.indexOf(socket.id);
          if (index > -1) {
            sockets.splice(index, 1);
          }
          if (sockets.length === 0) {
            this.userSockets.delete(userId);
          }
          logger.info(`User ${userId} disconnected socket ${socket.id}`);
        });

        // Handle custom events
        socket.on('join-room', (roomId: string) => {
          socket.join(roomId);
          logger.info(`Socket ${socket.id} joined room ${roomId}`);
        });

        socket.on('leave-room', (roomId: string) => {
          socket.leave(roomId);
          logger.info(`Socket ${socket.id} left room ${roomId}`);
        });
      }
    });

    logger.info('Socket.io initialized');
  }

  emitToUser(userId: string, event: string, data: any): void {
    const sockets = this.userSockets.get(userId);
    if (sockets && this.io) {
      sockets.forEach((socketId) => {
        this.io?.to(socketId).emit(event, data);
      });
    }
  }

  emitToRoom(room: string, event: string, data: any): void {
    this.io?.to(room).emit(event, data);
  }

  broadcast(event: string, data: any): void {
    this.io?.emit(event, data);
  }

  getIO(): SocketServer | null {
    return this.io;
  }
}

export default new SocketService();
