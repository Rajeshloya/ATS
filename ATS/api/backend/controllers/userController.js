import UserService from '../services/userService.js';

class UserController {
    static async userRegistration(req, res) {
        try {
            const result = await UserService.registerUser(req.body);
            res.status(result.status).send(result);
        } catch (error) {
            res.status(500).send({ status: "failed", message: "Unable to register user" });
        }
    }

    /* 
    
    static async sendOTP(req, res) {
         try {
             const result = await UserService.sendOTP(req.body.contact_number);
             res.status(result.status).send(result);
         } catch (error) {
             res.status(500).send({ status: "failed", message: "Failed to send OTP" });
         }
     }
 
     static async verifyOTP(req, res) {
         try {
             const result = await UserService.verifyOTP(req.body.otp);
             res.status(result.status).send(result);
         } catch (error) {
             res.status(500).send({ status: "failed", message: "Failed to verify OTP" });
         }
     }
 
     */
    static async userLogin(req, res) {

        try {
            const result = await UserService.loginUser(req.body);
            if (result.status === 200) {
                res.status(result.status).send(result);
            } else {
                res.status(400).send(result);
            }
        } catch (error) {
            res.status(500).send({ status: "failed", message: "Unable to login" });
        }
    }

    static async changeUserPassword(req, res) {
        try {
            const result = await UserService.changePassword(req.user._id, req.body);
            res.status(result.status).send(result);
        } catch (error) {
            res.status(500).send({ status: "failed", message: "Unable to change password" });
        }
    }

    static async loggedUser(req, res) {
        res.send({ user: req.user });
    }

    static async sendPasswordResetEmail(req, res) {
        const { email } = req.body;
        const result = await UserService.sendPasswordResetEmail(email);
        res.status(result.status).json({ message: result.message, link: result.link });
    }

    static async userPasswordReset(req, res) {
        const { userId, token } = req.params;
        const passwordData = req.body;
        const result = await UserService.resetPassword(userId, token, passwordData);
        res.status(result.status).json({ message: result.message });
    }


    static async getUserDetails(req, res) {
        try {
            const result = await UserService.getUserDetails(req.user);
            res.status(result.status).send(result);
        } catch (error) {
            logger.error("Error fetching user details:", error);
            res.status(500).send({ status: "failed", message: "Unable to fetch user details" });
        }
    }

    static async createContact(req, res) {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ status: 400, message: 'All fields are required' });
        }

        try {
            const result = await ContactService.createContact({ name, email, message });
            return res.status(result.status).json({ message: result.message });
        } catch (error) {
            console.error('Error creating contact:', error);
            return res.status(500).json({ status: 500, message: 'Internal server error' });
        }
    }
}

export default UserController;
