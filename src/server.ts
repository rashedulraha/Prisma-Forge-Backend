import app from "./app";
import "dotenv/config";
import { prisma } from "./lib/prisma";

const port = process.env.PORT;

const main = async () => {
  try {
    //  await prisma.$connect();
    console.log("connect to the database");
    app.listen(port, () => {
      console.log("Server is running : ", port);
    });
  } catch (error) {
    console.error("error starting the server : ", error);
    //await prisma.$disconnect();
    process.exit(1);
  }
};

main();
