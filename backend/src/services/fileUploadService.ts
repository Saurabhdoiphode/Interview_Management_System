import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import config from '../config';
import logger from '../utils/logger';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

class FileUploadService {
  async uploadFile(filePath: string, folder: string = 'general'): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `interview-management/${folder}`,
        resource_type: 'auto',
      });

      // Delete local file after upload
      await fs.unlink(filePath);

      return result.secure_url;
    } catch (error) {
      logger.error('Error uploading file to Cloudinary:', error);
      throw new Error('File upload failed');
    }
  }

  async uploadResume(filePath: string): Promise<string> {
    return this.uploadFile(filePath, 'resumes');
  }

  async uploadAvatar(filePath: string): Promise<string> {
    return this.uploadFile(filePath, 'avatars');
  }

  async uploadDocument(filePath: string): Promise<string> {
    return this.uploadFile(filePath, 'documents');
  }

  async deleteFile(publicUrl: string): Promise<boolean> {
    try {
      // Extract public_id from URL
      const urlParts = publicUrl.split('/');
      const filename = urlParts[urlParts.length - 1];
      const publicId = `interview-management/${filename.split('.')[0]}`;

      await cloudinary.uploader.destroy(publicId);
      return true;
    } catch (error) {
      logger.error('Error deleting file from Cloudinary:', error);
      return false;
    }
  }
}

export default new FileUploadService();
