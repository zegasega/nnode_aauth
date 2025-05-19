const UserService = require('../services/user_service');
const EmailService = require('../services/email_service');

class BaseController {
  constructor() {
    this.UserService = new UserService();   // Burada hata varsa bu satırda olur
    this.EmailService = new EmailService();
  }
}

module.exports = BaseController;
