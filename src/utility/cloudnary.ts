import cloudinary from "cloudinary";
import { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } from "config";

const cloudinaryAny: any = cloudinary;
cloudinaryAny.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

export default cloudinaryAny;
