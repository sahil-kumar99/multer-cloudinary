import nodemailer from "nodemailer";
import path from "path";

// initialize nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "chatgpt.sahil@gmail.com",
    pass: "znur khpe mvkv klgb",
  },
});

// point to the template folder
// const handlebarOptions: any = {
//   viewEngine: {
//     partialsDir: path.join(__dirname, "/views/"),
//     defaultLayout: false,
//   },
//   viewPath: path.join(__dirname, "/views/"),
// };

// use a template file with nodemailer
// transporter.use("compile", hbs(handlebarOptions));

export {
  transporter,
  // handlebarOptions
};
