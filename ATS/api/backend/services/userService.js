import UserModel from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import transporter from '../config/emailConfig.js';
import logger from '../logger.js'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+\d{1,3}\s?\d{10}$/;

class UserService {
    static async registerUser(userData) {
        const { firstname, lastname, email, recoveryEmail, contact_number, password, password_confirmation, tc } = userData;

        try {
            if (!emailRegex.test(email)) {
                logger.error("Invalid email format");
                return { status: 400, message: "Invalid email format" };
            }

            if (!phoneRegex.test(contact_number)) {
                logger.error("Invalid phone number format");
                return { status: 400, message: "Invalid phone number format" };
            }

            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                logger.error("Email is already registered");
                return { status: 400, message: "Email is already registered" };
            }

            if (password !== password_confirmation) {
                logger.error("Password and confirm password do not match");
                return { status: 400, message: "Password and confirm password do not match" };
            }

            if (!firstname || !lastname || !recoveryEmail || !tc) {
                logger.error("All fields are required");
                return { status: 400, message: "All fields are required" };
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new UserModel({
                firstname,
                lastname,
                email,
                recoveryEmail,
                contact_number,
                password: hashedPassword,
                tc
            });

            await newUser.save();

            const token = jwt.sign({ userID: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

            logger.info("User registered successfully");
            return { status: 200, message: "User registered successfully", token };
        } catch (error) {
            logger.error("Error during user registration:", error);
            return { status: 500, message: "Internal server error" };
        }
    }

    static async loginUser(userData) {
        const { email, password } = userData;

        if (!email || !password) {
            return { status: 400, message: "All fields are required" };
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return { status: 400, message: "You are not a registered user" };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { status: 400, message: "Email or password is not valid" };
        }

        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1m' });

        return { status: 200, message: "Login successful", token };
    }

    static async changePassword(userId, passwordData) {
        const { password, password_confirmation } = passwordData;

        if (!password || !password_confirmation) {
            return { status: 400, message: "All fields are required" };
        }

        if (password !== password_confirmation) {
            return { status: 400, message: "New Password and Confirm New Password don't match" };
        }

        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);

        await UserModel.findByIdAndUpdate(userId, { password: newHashPassword });

        return { status: 200, message: "Password changed successfully" };
    }

    static async sendPasswordResetEmail(email) {
        try {
            const user = await UserModel.findOne({ recoveryEmail: email });
            if (!user) {
                logger.error("Email doesn't exist");
                return { status: 400, message: "Email doesn't exist" };
            }

            // Generate reset token
            const resetToken = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
            const new_secret = user._id + process.env.JWT_SECRET_KEY;
            const token = jwt.sign({ userID: user._id, resetToken }, new_secret, { expiresIn: '15m' });

            // Save reset token to user document
            user.resetToken = resetToken;
            await user.save();

            const link = `http://localhost:3000/api/user/reset-password` + user._id + '/' + token;

            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: user.recoveryEmail,
                subject: "Password Reset Link",
                html: `<a href="${link}">Click Here</a> to Reset Your Password`,
            };

            await transporter.sendMail(mailOptions);

            logger.info("Password reset email sent successfully");
            return { status: 200, message: "Password reset email sent. Please check your email", link };
        } catch (error) {
            logger.error("Error sending password reset email:", error);
            return { status: 500, message: "Internal server error" };
        }
    }


    static async resetPassword(userId, token, passwordData) {
        const { password, password_confirmation } = passwordData;

        try {
            const user = await UserModel.findById(userId);

            if (!user) {
                logger.error('User not found', { userId });
                return { status: 400, message: "User not found" };
            }

            const secret = user._id + process.env.JWT_SECRET_KEY;

            try {
                const decodedToken = jwt.verify(token, secret);

                if (!password || !password_confirmation) {
                    logger.error('Password and password confirmation fields are required');
                    return { status: 400, message: "All fields are required" };
                }

                if (password !== password_confirmation) {
                    logger.error('Password and password confirmation do not match', { userId });
                    return { status: 400, message: "New Password and Confirm New Password don't match" };
                }

                // Check if the reset token matches the one saved in the user document
                if (decodedToken.resetToken !== user.resetToken) {
                    logger.error('Invalid reset token', { userId });
                    return { status: 400, message: "Invalid reset token" };
                }

                const salt = await bcrypt.genSalt(10);
                const newHashPassword = await bcrypt.hash(password, salt);

                await UserModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } });

                logger.info('Password reset successfully', { userId });
                return { status: 200, message: "Password reset successfully" };

            } catch (error) {
                logger.error('Invalid token', { error, userId });
                return { status: 400, message: "Invalid token" };
            }

        } catch (error) {
            logger.error('Error occurred during password reset', { error, userId });
            return { status: 500, message: "Internal server error" };
        }
    }


    static async getUserDetails(user) {
        try {
            const userDetails = await UserModel.findById(user._id).select('-password');
            if (!userDetails) {
                return { status: 400, message: "User not found" };
            }

            return { status: 200, user: userDetails };
        } catch (error) {
            logger.error("Error fetching user details:", error);
            return { status: 500, message: "Internal server error" };
        }
    }

}


export default UserService;