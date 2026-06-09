const rateLimit = require("express-rate-limit");

const controllerLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many attempts. Try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
});

module.exports = {
  controllerLimiter,
  apiLimiter
};