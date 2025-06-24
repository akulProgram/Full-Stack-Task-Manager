
class User {
  constructor(id, username, password) {
    this.id = id;
    this.username = username;
    this.password = password;
  }

  isValidPassword(inputPassword) {
    return this.password === inputPassword;
  }
}

module.exports = User;
