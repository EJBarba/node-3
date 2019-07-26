function create(req, res) {
  const db = req.app.get("db");

  const { email, password } = req.body;

  db.users
    .insert(
      {
        email,
        password,
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
    .then(user => res.status(201).json(user))
    .catch(err => {
      console.error(err);
    });
}
function list(req, res) {
  const db = req.app.get("db");

  db.users
    .find()
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
}

function getById(req, res) {
  const db = req.app.get("db");

  db.users
    .findOne(req.params.id)
    .then(user => res.status(200).json(user))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
}

function getProfile(req, res) {
  const db = req.app.get("db");

  db.user_profiles
    .findOne({
      userId: req.params.id
    })
    .then(profile => res.status(200).json(profile))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
}

function createPost(req, res) {
  const db = req.app.get("db");

  const { userId, content } = req.body;

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
}

function getPost(req, res) {
  const db = req.app.get("db");

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
}
function getPostByUserId(req, res) {
  const db = req.app.get("db");

  db.posts
    .find(req.params)
    .then(posts => res.status(200).json(posts))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
}
function updatePost(req, res) {
  const db = req.app.get("db");

  db.posts
    .update(req.query, req.body)
    .then(post => res.status(200).json(post))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
}
function comment(req, res) {
  const db = req.app.get("db");
  const { userId, postId, comment } = req.body;
  console.log(req.body);
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
}

function editComment(req, res) {
  const db = req.app.get("db");

  //uses query to find comment by id, like in update Post
  db.comments
    .update(req.query, req.body)
    .then(comments => res.status(200).json(comments))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
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
  editComment
};
