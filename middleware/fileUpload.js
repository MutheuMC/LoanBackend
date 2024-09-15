const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    // Create a file name with a consistent format
    const fileName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    // Store the file path in the request object for later use
    req.filePath = path.join('uploads', fileName).replace(/\\/g, '/');
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images and PDFs
  const allowedFileTypes = /jpeg|jpg|png|gif|pdf/i;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    req.fileValidationError = 'Only image (jpeg, jpg, png, gif) and PDF files are allowed!';
    return cb(new Error('Only image (jpeg, jpg, png, gif) and PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

module.exports = upload;