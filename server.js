require("dotenv").config();
const app = require("./src/app");
const connectDatabase = require("./src/config/db");
const logger = require("./src/config/logger");

const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
  await connectDatabase();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

bootstrap().catch((error) => {
  logger.error("Failed to start server", error);
  process.exit(1);
});
