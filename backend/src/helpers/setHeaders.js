const dotenv = require("dotenv");
dotenv.config();

function setHeaders(req, res, next) {
  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

  const origin = req.get("origin");

  if (allowedOrigins.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }

  const formattedOrigins = process.env.ALLOWED_ORIGINS.split(",").join(" ");

  res.set(
    "Content-Security-Policy",
    `default-src 'self' ${formattedOrigins}; script-src 'self'`
  );

  next();
}

module.exports = setHeaders;
