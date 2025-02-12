const express = require("express");
const massive = require("massive");

const users = require("./controllers/users.js");

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
  app.get("/api/posts", users.getPost);
  app.get("/api/posts/:userId", users.getPostByUserId);
  app.patch("/api/posts", users.updatePost);
  app.post("/api/comments", users.comment);
  app.patch("/api/comments", users.editComment);
  const PORT = 3001;

  //updates for auth
  app.get("/api/protected/data", users.auth);

  app.listen(PORT, () => {
    console.log(`Server listening (O-O) on port ${PORT}`);
  });
});
