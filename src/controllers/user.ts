import { Request, Response } from "express";
import bcrypt from "bcrypt";
// import crypto from "crypto";
import ejs from "ejs";
import path from "path";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
// import hbs from "nodemailer-express-handlebars";
import User from "models/user";
import { FRONT_URL, JWT_SECRET } from "config";
import Otp from "models/otp";
import { transporter } from "nodemailer/config";
import cloudinary from "utility/cloudnary";

interface IRequest extends Request {
  file: any;
}

// export const home = async (req: Request, res: Response) => {
//   res.render("home");
// };

export const signup = async (req: Request, res: Response) => {
  console.log("--signup controller---");
  const { username, email, password } = req.body;
  try {
    if (!username || !password || !email) {
      return res
        .status(500)
        .json({ status: false, message: "all fields required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return res
      .status(200)
      .json({ status: true, message: "signup successfully" });
  } catch (error) {
    return res
      .send(500)
      .json({ status: true, message: "internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user: any = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ status: false, message: "user not exist" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(500).json({ status: false, message: "invalid password" });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    JWT_SECRET as string,
    {
      expiresIn: "24h",
    }
  );

  return res
    .status(200)
    .json({ status: true, message: "login successfull", token });
};

export const forgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "email not exist" });
    }

    const otp = await Otp.findOne({ userId: user._id });
    if (otp) await otp.deleteOne();

    const otp_new = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // const mailOptions = {
    //   from: "from@domain.com",
    //   to: "sahil2.eminence@gmail.com",
    //   subject: "Test forget password",
    //   // template: "forgetPassword",
    //   // context: {
    //   //   userName: user.username,
    //   //   otp: otp_new,
    //   // },

    ejs.renderFile(
      path.join(__dirname, "../email_template/forgetPassword.ejs"),
      { username: email, otp: otp_new },
      async function (err, data) {
        if (err) {
          console.log(err);
        } else {
          const mailOptions = {
            from: "from@domain.com",
            to: "sahil2.eminence@gmail.com",
            subject: "verify otp",
            html: data,
          };
          //console.log("html data ======================>", mainOptions.html);

          transporter.sendMail(mailOptions, async function (err, info) {
            if (err) {
              res.json({
                status: false,
                message: "email sending failed",
              });
            } else {
              const newOtp = new Otp({
                userId: user._id,
                otp: otp_new,
                createdAt: Date.now(),
              });
              await newOtp.save();
              res.json({
                status: true,
                message: "email sending success",
              });
            }
          });
        }

        // transporter.use("compile", hbs(handlebarOptions));
        // transporter.sendMail(mailOptions, async (err, data) => {
        //   if (err) {
        //     console.log("Otp sent error" + err);
        //     return res
        //       .status(500)
        //       .json({ status: true, message: "otp send failed" });
        //   } else {
        //     console.log("Otp sent successfully", otp_new);
        //     const newOtp = new Otp({
        //       userId: user._id,
        //       otp: otp_new,
        //       createdAt: Date.now(),
        //     });
        //     await newOtp.save();
        //     return res
        //       .status(200)
        //       .json({ status: true, message: "otp sent successfully" });
        //   }
        // });
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "internal server error" });
  }
};

export const validateOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ status: false, message: "email & otp is required" });
  }
};

export const uploadProfile = async (req: IRequest, res: Response) => {
  if (!req.file) {
    return res
      .status(500)
      .json({ status: false, message: "upload only image files" });
  }
  try {
    const upload = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "images",
    });
    return res.json({
      status: true,
      file: upload.secure_url,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ status: false, message: "internal server error" });
  }
};

export const getImages = async (req: Request, res: Response) => {
  var result = [];

  var options = {
    resource_type: "image",
    folder: "images",
    max_results: 500,
  };

  // function listResources(next_cursor) {
  //   if (next_cursor) {
  //     options["next_cursor"] = next_cursor;
  //   }
    console.log('______________options',options);
    cloudinary.api.resources(options, function (error:any, res: any) {
      if (error) {
        console.log(error);
      }
      // var more = res.next_cursor;
      let resources = res.resources;

      console.log('----resources---', resources);
      
      // for (var res in resources) {
      //   res = resources[res];
      //   var resultTemp = [];
      //   var url = res.secure_url;
      //   resultTemp.push(url);
      //   result.push(resultTemp);
      // }

      // if (more) {
      //   // listResources(more);
      // } else {
      //   console.log("done");
      // }
    });
  // }
  // listResources(null);
}
