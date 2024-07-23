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
      const userId = req.userId;
      const uuid = uuidv4();
      const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
      const fileName = `${userId}_${uuid}_${timestamp}`;
      return fileName;
      },
  },
});

const storagev2 = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_photos', // Nama folder di Cloudinary 
    public_id: (req, file) => {
      const userId = req.userId;
      const uuid = uuidv4();
      const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss'); // Ensure this is available in the request
      const fileName = `${userId}_${uuid}_${timestamp}`; // Include userId in the public ID
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

  const limits = {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    
  };
  
  const upload = multer({ storage: storage, fileFilter: fileFilter, limits: limits});
  const uploadv2 = multer({ storage: storagev2, fileFilter: fileFilter, limits: limits });
  
  const uploadSingle = upload.single('photo');
  const uploadSingleProfileimg = uploadv2.single('photo');
  
  export { uploadSingle, uploadSingleProfileimg };