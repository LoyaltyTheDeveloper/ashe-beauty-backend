// const multer = require('multer');
// const path = require('path');


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/upload'); 
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     const filename = `${Date.now()}-${file.fieldname}${ext}`;
//     cb(null, filename);
//   }
// });


// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|svg/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);
//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only .jpg, .jpeg, .png, and .svg files are allowed'));
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// });

// module.exports = upload;

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../public/upload");

// make sure folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|svg/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, .png, and .svg files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
