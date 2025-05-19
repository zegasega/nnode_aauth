const UserService = require('../services/user_service');
const EmailService = require('../services/email_service');

class BaseController {
  constructor() {
    this.UserService = new UserService(); 
    this.EmailService = new EmailService();
  }
}

module.exports = BaseController;
