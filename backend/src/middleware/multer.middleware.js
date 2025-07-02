import multer from "multer";
import path from "path";
import fs from "fs";

let uploadBookImages;
let uploadProfileImage;

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
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, uniqueName);
    },
  });

  // File filter to allow only image files
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  };

  // Multer base setup
  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  });

  // Upload handler for multiple book images
  uploadBookImages = upload.fields([{ name: "bookImages", maxCount: 5 }]);

  // Upload handler for single profile image
  uploadProfileImage = upload.single("profileImage");

} catch (err) {
  console.error("Error initializing multer middleware:", err.message);

  const errorHandler = (req, res, next) => {
    return res.status(500).json({
      message: "File upload middleware failed to initialize.",
    });
  };

  uploadBookImages = errorHandler;
  uploadProfileImage = errorHandler;
}

export { uploadBookImages, uploadProfileImage };
