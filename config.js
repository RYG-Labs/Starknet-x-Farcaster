const dotenv = require("dotenv");

dotenv.config();

const {
  SECRET_KEY_ENCODED,
  SECREY_IV_ENCODED,
  ENCRYPTION_METHOD,
  MONGODB_URI,
} = process.env;

exports.moudle = {
  secret_key: SECRET_KEY_ENCODED,
  secret_iv: SECREY_IV_ENCODED,
  ecnryption_method: ENCRYPTION_METHOD,
  mongodb_uri: MONGODB_URI,
};
