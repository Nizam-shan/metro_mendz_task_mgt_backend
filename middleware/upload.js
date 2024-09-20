import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = "./my-uploads";
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});

// accept only pdf

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 10MB in bytes
  },
});

export default upload;
