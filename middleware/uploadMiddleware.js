import multer from 'multer';

const storage = multer.memoryStorage(); // Menyimpan foto di memori
const upload = multer({ storage: storage });

// Middleware untuk menangani upload file foto
const uploadSingle = upload.single('photo');

export { uploadSingle };
