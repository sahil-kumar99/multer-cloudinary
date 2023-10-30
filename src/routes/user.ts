import {
  login,
  signup,
  forgetPassword,
  uploadProfile,
  getImages,
} from "controllers/user";
import express, { Router } from "express";
import uploader from "utility/multer";
import { auth } from "middlewares/auth";
const router: Router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.post(
  "/uploadProfile",
  [uploader.single("file"), auth as any],
  uploadProfile as any
);
router.post("/getImages", getImages);

const userRouter = router;
export default userRouter;
