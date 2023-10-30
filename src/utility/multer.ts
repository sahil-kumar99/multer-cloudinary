import multer from "multer";

const uploader = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 500000 },
  fileFilter: function (req, file: any, callback) {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
});

export default uploader;
