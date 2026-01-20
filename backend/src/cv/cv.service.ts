import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CV } from './entities/cv.entity';
import { User } from '../users/user.entity';
import * as fs from 'fs';
import * as path from 'path';

interface MulterFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class CvService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'cv');

  constructor(
    @InjectRepository(CV)
    private cvRepository: Repository<CV>,
    private dataSource: DataSource,
  ) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadCV(user: User, file: MulterFile): Promise<CV> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Find the latest version to determine next version
      const currentLatest = await queryRunner.manager.findOne(CV, {
        where: { userId: user.id, isLatest: true },
      });

      let nextVersion = 1;
      if (currentLatest) {
        nextVersion = currentLatest.version + 1;
        // Mark old as not latest
        currentLatest.isLatest = false;
        await queryRunner.manager.save(currentLatest);
      }

      // 2. Prepare file storage
      const userDir = path.join(this.uploadDir, user.id);
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
      }

      const fileExt = path.extname(file.originalname);
      const safeFileName = `v${nextVersion}_${Date.now()}${fileExt}`;
      const filePath = path.join(userDir, safeFileName);

      // 3. Write file
      fs.writeFileSync(filePath, file.buffer);

      // 4. Create new CV entity
      const newCV = this.cvRepository.create({
        fileName: file.originalname,
        filePath: filePath,
        fileType: file.mimetype,
        fileSize: file.size,
        version: nextVersion,
        isLatest: true,
        userId: user.id,
      });

      const savedCV = await queryRunner.manager.save(newCV);

      await queryRunner.commitTransaction();
      return savedCV;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(userId: string): Promise<CV[]> {
    return this.cvRepository.find({
      where: { userId },
      order: { version: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<CV> {
    const cv = await this.cvRepository.findOne({
      where: { id, userId },
    });
    if (!cv) {
      throw new NotFoundException('CV not found');
    }
    return cv;
  }

  async getFilePath(id: string, userId: string): Promise<string> {
    const cv = await this.findOne(id, userId);
    if (!fs.existsSync(cv.filePath)) {
      throw new NotFoundException('File not found on server');
    }
    return cv.filePath;
  }

  async findById(id: string): Promise<CV> {
    const cv = await this.cvRepository.findOne({
      where: { id },
    });
    if (!cv) {
      throw new NotFoundException('CV not found');
    }
    return cv;
  }

  async getFilePathById(id: string): Promise<string> {
    const cv = await this.findById(id);
    if (!fs.existsSync(cv.filePath)) {
      throw new NotFoundException('File not found on server');
    }
    return cv.filePath;
  }
}
