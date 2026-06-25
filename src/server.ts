import app from "./app";
import { configuration } from "./configuration/index.config";

const port = configuration.port;

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
