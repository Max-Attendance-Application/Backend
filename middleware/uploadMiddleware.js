import moment from 'moment';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
import { v4 as uuidv4 } from 'uuid';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'absen_photos', // Nama folder di Cloudinary 
    public_id: (req, file) => {
        const originalName = file.originalname;
        const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
        const fileName = `${originalName}_${timestamp}`;
        return fileName;
      },
  },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const mimeType = allowedTypes.test(file.mimetype.toLowerCase());
    const extname = allowedTypes.test(file.originalname.toLowerCase());
  
    if (mimeType && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  };
  
  const upload = multer({ storage: storage, fileFilter: fileFilter });
  
  const uploadSingle = upload.single('photo');
  
  export { uploadSingle };