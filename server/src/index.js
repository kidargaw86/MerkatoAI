import "dotenv/config";
import { createContainer } from "./config/container.js";
import { createHttpServer } from "./interfaces/http/server.js";

const container = createContainer();
const app = createHttpServer(container);
const port = Number(process.env.PORT || 4000);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
