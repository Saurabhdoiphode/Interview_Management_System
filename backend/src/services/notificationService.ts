import { Notification } from '../models';
import { NotificationType } from '../types';
import logger from '../utils/logger';

class NotificationService {
  async createNotification(
    recipient: string,
    type: NotificationType,
    title: string,
    message: string,
    link?: string,
    metadata?: Record<string, any>
  ) {
    try {
      const notification = await Notification.create({
        recipient,
        type,
        title,
        message,
        link,
        metadata,
      });

      // Emit socket event (will be implemented later)
      // socketService.emitToUser(recipient, 'notification', notification);

      return notification;
    } catch (error) {
      logger.error('Error creating notification:', error);
      return null;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    return Notification.countDocuments({ recipient: userId, isRead: false });
  }

  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      await Notification.updateOne(
        { _id: notificationId, recipient: userId },
        { isRead: true }
      );
      return true;
    } catch (error) {
      logger.error('Error marking notification as read:', error);
      return false;
    }
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
      return true;
    } catch (error) {
      logger.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  async getUserNotifications(userId: string, limit: number = 50) {
    return Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}

export default new NotificationService();
