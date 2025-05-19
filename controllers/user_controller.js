const BaseController = require('../core/base_controller');

class UserController extends BaseController {
  constructor() {
    super();
  }

  async Register(req, res) {
    try {
      const newUser = await this.UserService.registerUser(req.body);
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

  
}

module.exports = new UserController();
