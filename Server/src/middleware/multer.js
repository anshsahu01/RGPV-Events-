// import multer from 'multer';



// const storage = multer.memoryStorage();

// const upload = multer({ storage });

// export default upload

import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Temporary directory banayein agar exist nahi karti
const tempDir = './public/temp';
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  // Yeh batata hai ki file kahan save hogi
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  // Yeh batata hai ki file ka naam kya hoga
  filename: function (req, file, cb) {
    // Unique filename banate hain taaki files overwrite na ho
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
    storage: storage,
    // Optional: Aap file size limit bhi laga sakte hain
    limits: { fileSize: 1024 * 1024 * 5 } // 5 MB limit
});

export default upload;