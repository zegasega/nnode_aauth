const BaseController = require('../core/base_controller');

class UserController extends BaseController {
  constructor() {
    super();
  }
  async ChangePassword(req, res) {
    try {
      const id = req.user.id;
      const { code, newPassword } = req.body;
      const result = await this.UserService.changePassword(id, code, newPassword);
      res.status(200).json({ message: result.message });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async ResetPassword(req, res) {
    try {
      const email = req.user.email;
      await this.EmailService.sendResetPasswordEmail(email);
      res.status(200).json({message: "reset password code has been sent to your email adress"});
    } catch (error) {
      res.status(400).json({message: error});
    }
  }

  async Register(req, res) {
    try {
      const newUser = await this.UserService.registerUser(req.body);
      await this.EmailService.sendWelcomeEmail(newUser.email);
      res.status(201).json({ message: "Success", data: newUser });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  async Login(req, res) {
    try {
        const { email, password } = req.body;
        const result = await this.UserService.loginUser({email, password});
        res.status(200).json({ message: 'Login successful', data: result });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
  }
  
  async Logout(req, res) {
    try {
      const userId = req.user.id;
      await this.UserService.logoutUser(userId);

      res.status(200).json({
        message: "Logout successful. Tokens are now invalid.",
      });
      console.log(req.user.jwtTokenVersion)
    } catch (error) {
      res.status(500).json({
        message: error.message || "Logout failed",
      });
    }
  }

  async AllUsers(req, res) {
    try {
      const users = await this.UserService.getAllUser();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  async VerifyAccount(req, res) {
    try {
      const email = req.user.email;
      const { verification_type } = req.body;
      await this.EmailService.sendVerificationCode(email, verification_type)
      res.status(200).json({message: "Verification Code has been sent to your email!"})
    } catch (error) {
      res.status(400).json({message :error})
      
    }
  }
  
}

module.exports = new UserController();
