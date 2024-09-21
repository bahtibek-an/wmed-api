import {
  Controller,
  Post,
  UploadedFile,
  BadRequestException, Req,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firebaseStorage } from '../../configs/firebase';

@ApiTags("Upload File")
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUploadDto })
  @Post()
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    const imageName = file?.filename;
    if (!imageName) {
      throw new BadRequestException(['File is required']);
    }
    const storageRef = ref(firebaseStorage, "/images");
    const snapshot = await uploadBytes(storageRef, file.buffer);
    const fileUrl = await getDownloadURL(snapshot.ref);
    return { url: fileUrl };
  }

}
