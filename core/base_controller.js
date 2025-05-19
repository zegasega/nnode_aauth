const UserService = require('../services/user_service');

class BaseController {
  constructor() {
    this.UserService = UserService;

  }


}

module.exports = BaseController;