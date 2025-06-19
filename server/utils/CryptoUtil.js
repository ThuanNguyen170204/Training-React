const crypto = require("crypto");

const CryptoUtil = {
  hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
    return `${salt}:${hash}`;
  },

  comparePassword(plainPassword, hashedPassword) {
    const [salt, hash] = hashedPassword.split(":");
    const hashToCompare = crypto
      .pbkdf2Sync(plainPassword, salt, 1000, 64, "sha512")
      .toString("hex");
    return hash === hashToCompare;
  },

  md5(text) {
    return crypto.createHash("md5").update(text).digest("hex");
  },
};

module.exports = CryptoUtil;
