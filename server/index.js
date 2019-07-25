const express = require("express");
const massive = require("massive");

const users = require("./controllers/users.js");
const safeStringify = require("fast-safe-stringify");

massive({
  host: "localhost",
  port: 5432,
  database: "node3",
  user: "postgres",
  password: "node3db"
}).then(db => {
  const app = express();

  app.set("db", db);

  app.use(express.json());

  // server/index.js - register the handler
  app.post("/api/users", users.create);
  app.get("/api/users", users.list);
  app.get("/api/users/:id", users.getById);
  app.get("/api/users/:id/profile", users.getProfile);
  app.post("/api/posts", users.createPost);

  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`Server listening (O-O) on port ${PORT}`);
  });
});
