import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/database";

async function main() {
  try {
    await prisma.$connect();
    // eslint-disable-next-line no-console
    console.log("✅ Database connected successfully");

    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Server running on http://localhost:${env.port}`);
      // eslint-disable-next-line no-console
      console.log(`🌍 Environment: ${env.nodeEnv}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

main();

process.on("unhandledRejection", (reason) => {
  // eslint-disable-next-line no-console
  console.error("Unhandled Rejection:", reason);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
