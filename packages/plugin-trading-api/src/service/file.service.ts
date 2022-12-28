import * as fs from 'fs';
import ImagePathNotFoundException from '../exception/error';
// import S3Service from './s3.service';
import { UserFilesConst } from '../constants/user';

export default class FileService {
  _s3;
  constructor() {
    // this._s3 = new S3Service();
  }
  getOne = async params => {
    let res = await this._s3.getObject(params.path);
    return res;
  };
  saveFile = async ({ user, image, type }) => {
    const basePath = process.env.IMAGE_PATH;

    if (!basePath) {
      // throw new ImagePathNotFoundException();
      throw new Error('Image path not found');
    }

    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath);
    }

    let folder = '';
    switch (type) {
      case UserFilesConst.TYPE_NATIONAL_CARD_FRONT:
        folder = 'front';
        break;
      case UserFilesConst.TYPE_NATIONAL_CARD_BACK:
        folder = 'back';
        break;
      case UserFilesConst.TYPE_BIRTH_CERTIFICATE:
        folder = 'birth';
        break;
      case UserFilesConst.TYPE_SIGNATURE:
        folder = 'signature';
        break;
      case UserFilesConst.TYPE_PROFILE:
        folder = 'profile';
        break;
      case UserFilesConst.TYPE_OTHER:
        folder = 'other';
        break;
    }

    let imagePath = basePath.endsWith('/')
      ? `${basePath}${folder}`
      : `${basePath}/${folder}`;
    if (!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath);
    }

    imagePath = `${imagePath}/${new Date().getFullYear()}`;
    if (!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath);
    }
    image = image.replace(/^data:image\/png;base64,/, '');
    image = image.replace(/^data:image\/jpeg;base64,/, '');
    const path = `${imagePath}/${user.uuid}.jpeg`;

    fs.writeFile(path, image, 'base64', err => {
      if (err) throw new Error('Cannot write file');
    });
    let fullPath = process.env.APP_URL + path;
    let s3Path = await this._s3.s3UploadPath(path, folder);
    fullPath = s3Path;
    return { path, fullPath };
  };
}

module.exports = FileService;
