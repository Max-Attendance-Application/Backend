import User from "../models/UserModel.js";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import argon2 from "argon2";
import UserModel from "../models/UserModel.js";
import cloudinary from 'cloudinary';
import { uploadSingleProfileimg } from '../middleware/uploadMiddleware.js';
import multer from "multer";

export const getUser =  async (req, res) => {
    try {
        const response = await User.findAll(
            {attributes: ["id", "uuid", "name", "email", "username", "gender", "division", "position", "role"]
    });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
            
}

export const getUserById = async (req, res) => {
    try {
      // Fetch the user by UUID from the request parameters
      const user = await User.findOne({
        attributes: ["id", "uuid", "name", "email", "username", "gender", "division", "position", "role"],
        where: {
          id: req.params.id
        }
      });
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Return the user details
      res.status(200).json(user);
    } catch (error) {
      // Handle any errors that occur during the database query
      res.status(500).json({ error: error.message });
    }
  };


export const createUser = async (req, res) => {
    const {name, email, password, confPassword, username, gender, division, position, role} = req.body;
    // Log nilai req.body dan password
    console.log("Request Body:", req.body);
    console.log("Password:", password);
    console.log("ConfPassword:", confPassword);
    // Validasi bahwa password dan confPassword cocok
    if (password !== confPassword) {return res.status(400).json({ msg: "Password dan konfirmasi password tidak cocok" }); }
    // Periksa apakah username sudah ada
     // Check if email already exists
     const existingEmail = await User.findOne({ where: { email } });
     if (existingEmail) {
         return res.status(400).json({ msg: "Email already exists, please choose another" });
     }
 
     // Check if username already exists
     const existingUsername = await User.findOne({ where: { username } });
     if (existingUsername) {
         return res.status(400).json({ msg: "Username already exists, please choose another" });
     }
    const hashPassword = await argon2.hash(password);
       try {
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            username: username,
            gender: gender,
            division: division,
            position: position,
            role: role
        });
        
        res.status(201).json({msg: "Registration successful"});
       } catch (error) {
            res.status(400).json({ error: error.message });
       }
      

}

export const updateUser = async(req, res) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!user) return res.status(404).json({ msg: "User not found" });

        const { name, email, password, confPassword, username, gender, division, position, role } = req.body;

        // Log untuk debugging
        console.log("Request Body:", req.body);
        console.log("Password:", password);
        console.log("ConfPassword:", confPassword);

        // Periksa apakah username baru sudah ada kecuali milik pengguna ini
    if (username && username !== user.username) {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ msg: "Username sudah ada, silakan pilih username lain" });
        }
    }

    if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ msg: "Email sudah ada, silakan pilih email lain" });
        }
    }

        let hashPassword;
        if (password === "" || password === null || password === undefined) {
            hashPassword = user.password;
        } else {
            if (password !== confPassword) {
                return res.status(400).json({ msg: "Password dan konfirmasi password tidak cocok" });
            }
            hashPassword = await argon2.hash(password);
        }

        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            username: username,
            gender: gender,
            division: division,
            position: position,
            role: role
        }, {
            where: {
                id: user.id
            }
        });

        res.status(200).json({ msg: "User Updated" });
    } catch (error) {
        console.error(error); // Log error untuk debugging
        res.status(400).json({ error: error.message });
    }
};

export const uploadProfileImage = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }
  
      const userId = req.userId; // Assuming you get the user ID from the request (e.g., from a verified token)
      const newImageUrl = req.file.path; // Cloudinary URL
  
      const user = await UserModel.findOne({
        where: { id: userId }
      });
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Delete old profile image
      if (user.urlprofile) {
        const oldImagePublicId = user.urlprofile.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(oldImagePublicId);
      }
  
      // Upload new image to Cloudinary
      const newImagePublicId = `profile_photos/${userId}_${Date.now()}`;
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        public_id: newImagePublicId, // Set the public ID
      });
  
      // Update the user's profile image URL in the database
      user.urlprofile = uploadResult.secure_url; // Use the URL from the upload result
      await user.save();
  
      res.status(200).json({ msg: 'Profile image uploaded successfully', url: user.urlprofile });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };
  
  // Middleware to handle file upload errors
  export const handleFileUpload = (req, res, next) => {
    uploadSingleProfileimg(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ msg: 'File size exceeds the 5MB limit' });
        } else if (err) {
          return res.status(400).json({ msg: err.message });
        }
      }
      next();
    });
  };

export const deleteUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User not found"});
    try {
        await User.destroy({
           where:{
            id: user.id
           }
        },{
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "User Deleted"});
       } catch (error) {
            res.status(400).json({ error: error.message });
       }

}


export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetLink = `http://localhost:5000/reset-password.html?token=${token}`;

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            debug: true, // Enable debug output
            logger: true // Enable logger
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            text: `Click the link to reset your password: ${resetLink}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Detailed error sending email:', error);
                return res.status(500).json({ msg: 'Error sending email', error: error.message });
            }
            res.status(200).json({ msg: 'Reset password link sent to your email' });
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const resetPassword = async (req, res) => {
    const { password, confPassword } = req.body;
    const token = req.params.token;

    if (password !== confPassword) {
        return res.status(400).json({ msg: "Passwords do not match" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ where: { email: decoded.email } });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const hashPassword = await argon2.hash(password);
        await User.update({ password: hashPassword }, { where: { email: decoded.email } });

        res.status(200).json({ msg: "Password has been reset successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
