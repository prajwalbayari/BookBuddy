import multer from "multer";
import path from "path";
import fs from "fs";

let uploadBookImages;

try {
  // Ensure the upload directory exists
  const uploadDir = "uploads/";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // Storage configuration
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const uniqueName = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${ext}`;
      cb(null, uniqueName);
    },
  });

  // File filter to allow only images
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  };

  // Multer instance
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  });

  uploadBookImages = upload.fields([{ name: "bookImages", maxCount: 5 }]);
} catch (err) {
  console.error("Error initializing multer middleware:", err.message);

  uploadBookImages = (req, res, next) => {
    return res
      .status(500)
      .json({ message: "File upload middleware failed to initialize." });
  };
}

export { uploadBookImages };
