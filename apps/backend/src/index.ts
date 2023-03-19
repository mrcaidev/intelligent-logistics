import { app } from "src/app";

const server = app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});

process.on("SIGTERM", () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server shut down.");
  });
});
