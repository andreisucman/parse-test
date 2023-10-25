require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ParseServer = require("parse-server").ParseServer;
const AWS = require("aws-sdk");
const http = require("http");
const rateLimit = require("express-rate-limit");
const S3Adapter = require("@parse/s3-files-adapter");
const setHeaders = require("./helpers/setHeaders.js");


/* DO - Spaces bucket configuration */
const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
const s3Options = {
  bucket: process.env.DO_SPACES_BUCKET_NAME,
  baseUrl: process.env.DO_SPACES_BASE_URL,
  region: process.env.DO_SPACES_REGION,
  directAccess: true,
  globalCacheControl: "public, max-age=31536000",
  bucketPrefix: process.env.DO_SPACES_BUCKET_PREFIX,
  s3overrides: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY,
    endpoint: spacesEndpoint,
  },
};
const s3Adapter = new S3Adapter(s3Options);

async function initServer() {
  const server = new ParseServer({
    /* General */
    databaseURI: process.env.MONGODB_URI,
    cloud: __dirname + "/cloud/main.js",
    serverURL: process.env.SERVER_URL + "/parse",
    masterKeyIps: process.env.MASTER_KEY_IPS.split(","),
    fileUpload: {
      enableForAnonymousUser: true,
      enableForAuthenticatedUser: true,
      enableForPublic: true,
    },
    verbose: true,

    maxUploadSize: "200mb",

    /* Security */
    allowClientClassCreation: false,
    appId: process.env.APP_ID,
    masterKey: process.env.MASTER_KEY,
    sessionLength: process.env.DEFAULT_SESSION_LENGTH, // 30 days
    renewSessions: process.env.RENEW_SESSION_ON_USE,

    /* File Storage*/
    filesAdapter: s3Adapter,

    passwordPolicy: {
      validatorPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
    },
  });

  const app = express();
  app.set("trust proxy", 1);

  const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(","),
    methods: ["GET", "POST"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
      "Preflight-Request",
      "Options",
    ],
    optionsSuccessStatus: 200,
  };

  app.options("*", cors(corsOptions));
  app.use("*", setHeaders);

  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // Limit each IP to 60 requests per `window`
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    trustProxy: true,
  });

  app.use(limiter);

  app.use(express.json());

  await server.start();
  app.use("/parse", server.app);

  const port = process.env.PORT || 3001;
  const httpServer = http.createServer(app);
  httpServer.listen(port, () => {
    console.log(`Server running on port ${port}.`);
  });
}

initServer();
