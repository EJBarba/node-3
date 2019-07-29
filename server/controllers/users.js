const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const secret = require("./../../secret.js");

function create(req, res) {
  const db = req.app.get("db");

  const { email, password } = req.body;

  argon2.hash(password).then(hash => {
    return db.users
      .insert(
        {
          email,
          password: hash,
          user_profiles: [
            // this is what is specifying the object
            // to insert into the related 'user_profiles' table
            {
              userId: undefined,
              about: null,
              thumbnail: null
            }
          ]
        },
        {
          deepInsert: true // this option here tells massive to create the related object
        }
      )
      .then(user => {
        const token = jwt.sign({ userId: user.id }, secret); // adding token generation
        res.status(201).json({ ...user, token });
      })
      .catch(err => {
        console.error(err);
      });
  });
}
function list(req, res) {
  const db = req.app.get("db");

  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secret); // will throw an Error when token is invalid!!!

    //list
    db.users
      .find()
      .then(users => res.status(200).json(users))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  } catch (err) {
    console.error(err);
    res.status(401).end();
  }
}

function getById(req, res) {
  const db = req.app.get("db");

  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secret); // will throw an Error when token is invalid!!!

    //getById
    db.users
      .findOne(req.params.id)
      .then(user => res.status(200).json(user))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  } catch (err) {
    console.error(err);
    res.status(401).end();
  }
}

function getProfile(req, res) {
  const db = req.app.get("db");

  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secret); // will throw an Error when token is invalid!!!

    //getProfile
    db.user_profiles
      .findOne({
        userId: req.params.id
      })
      .then(profile => res.status(200).json(profile))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  } catch (err) {
    console.error(err);
    res.status(401).end();
  }
}

function createPost(req, res) {
  const db = req.app.get("db");

  const { userId, content } = req.body;

  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secret); // will throw an Error when token is invalid!!!

    //createPost
    db.posts
      .insert(
        {
          userId,
          content
        },
        {
          deepInsert: true // this option here tells massive to create the related object
        }
      )
      .then(user => res.status(201).json(user))
      .catch(err => {
        console.error(err);
      });
  } catch (err) {
    console.error(err);
    res.status(401).end();
  }
}

function getPost(req, res) {
  const db = req.app.get("db");

  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secret); // will throw an Error when token is invalid!!!

    //getpost
    db.posts
      .findOne(req.query.id)
      .then(post => {
        let data = {
          post: [],
          comments: []
        };
        data = {
          post: post
        };
        if (req.query.id) {
          db.comments
            .find({
              postId: post.id
            })
            .then(comments => {
              data = {
                post: post,
                comments: comments
              };
              res.status(201).json(data);
            })
            .catch(err => res.status(500).end());
        } else {
          res.status(201).json(data);
        }
      })
      .catch(err => res.status(500).end());
  } catch (err) {
    console.error(err);
    res.status(401).end();
  }
}
function getPostByUserId(req, res) {
  const db = req.app.get("db");

  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secret); // will throw an Error when token is invalid!!!

    //getPostByUserId
    db.posts
      .find(req.params)
      .then(posts => res.status(200).json(posts))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  } catch (err) {
    console.error(err);
    res.status(401).end();
  }
}
function updatePost(req, res) {
  const db = req.app.get("db");

  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secret); // will throw an Error when token is invalid!!!

    //update post
    db.posts
      .update(req.query, req.body)
      .then(post => res.status(200).json(post))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  } catch (err) {
    console.error(err);
    res.status(401).end();
  }
}
function comment(req, res) {
  const db = req.app.get("db");
  const { userId, postId, comment } = req.body;

  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secret); // will throw an Error when token is invalid!!!

    //insert comment
    db.comments
      .insert(
        {
          userId,
          postId,
          comment
        },
        {
          deepInsert: true // this option here tells massive to create the related object
        }
      )
      .then(comments => res.status(201).json(comments))
      .catch(err => {
        console.error(err);
      });
  } catch (err) {
    console.error(err);
    res.status(401).end();
  }
}

function editComment(req, res) {
  const db = req.app.get("db");

  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secret); // will throw an Error when token is invalid!!!

    //uses query to find comment by id, like in update Post
    db.comments
      .update(req.query, req.body)
      .then(comments => res.status(200).json(comments))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  } catch (err) {
    console.error(err);
    res.status(401).end();
  }
}

function auth(req, res) {
  const db = req.app.get("db");
  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secret); // will throw an Error when token is invalid!!!
    res.status(200).json({ data: "here is the protected data" });
  } catch (err) {
    console.error(err);
    res.status(401).end();
  }
}

module.exports = {
  create,
  list,
  getById,
  getProfile,
  createPost,
  getPost,
  getPostByUserId,
  updatePost,
  comment,
  editComment,
  auth
};
