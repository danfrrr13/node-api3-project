
const express = require('express');

const router = express.Router();

const Users = require('./userDb.js');
const Post = require('../posts/postDb.js');

//POST new user to all users (insert()) MAYBE?????
router.post('/', validateUser, (req, res) => {
  // do your magic!
  const newUser = req.body;
  if(newUser.name.length === 0) {
    res.status(400).json({ message: 'Please provide a name for this user. ' })
  } else {
    Users.insert(newUser)
    .then(newU => {
      res.status(201).json({newU})
    })
    .catch(err => {
      console.log('error creating a new user', err)
      res.status(500).json({ errorMessage: 'There was an error while saving the user to the database.' })
    })
  }
  
});

//POST new post by user (insert()) MAYBE????
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  const newPost = req.body;
  const user_id = req.params.id;
  const newObj = {text: newPost.text, user_id}
  console.log(req.body)
  Post.insert(newObj)
    .then(newP => {
        res.status(201).json({newPost})
    })
    .catch(err => {
      console.log('error creating new post', err)
      res.status(500).json({ errorMessage: 'There was an error while saving the post to the database.' })
    })

});

//GET all users (get())
router.get('/', (req, res) => {
  // do your magic!
  Users.get()
    .then(users => {
      res.status(201).json(users)
    })
    .catch(err => {
      console.log('error getting users', err)
      res.status(500).json({ errorMessage: "The users information could not be retrieved."})
    })

});

//GET user by id (getById())
router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id;
  Users.getById(id)
    .then(user => {
        res.status(200).json({user})
    })
    .catch(err => {
      console.log('error getting specified user', err)
      res.status(500).json({ errorMessage: 'The user information could not be retrieved. '})
    })
});

//GET posts by user id (getUserPosts())
router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id;
  Users.getUserPosts(id)
    .then(posts => {
        res.status(200).json({posts})
    })
    .catch(err => {
      console.log('error getting posts for this user id', err)
      res.status(500).json({ errorMessage: 'The posts information could not be retrieved.' })
    })
});

//DELETE user by id (remove())
router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id;
  Users.remove(id)
    .then(deleted => {
      res.status(200).json({ message: 'User has been successfully deleted.' })
    })
    .catch(err => {
      console.log('error in delete', err)
      res.status(500).json({ errorMessage: 'The post could not be removed.' })
    })
  
});

//PUT edits user info by id (update())
router.put('/:id', validateUserId, validateUser, (req, res) => {
  // do your magic!
  const id = req.params.id;
  const updateUser = req.body;
 
    Users.update(id, updateUser)
      .then(upU => {
        console.log(upU)
        res.status(200).json({message: 'Successfully Updated!'})
      })
      .catch(err => {
        console.log('error updating user', err)
        res.status(500).json({ errorMessage: 'The users information could not be modified.' })
      })

});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const id = req.params.id;

  Users.getById(id)
    .then(userId => {
      if (userId) {
        next()
      } else {
        res.status(400).json({ message: "invalid user id" })
      }
    })
    .catch(err => {
      console.log('error in getting user by id', err)
      res.status(400).json({ errorMessage: 'There was an error getting this users id.' })
    })

}

function validateUser(req, res, next) {
  // do your magic!
  const field = req.body;

  if (!field) {
    res.status(400).json({message: 'missing user data'})
  } else if (field.name.length === 0) {
    res.status(400).json({message: 'missing required name field'})
  } else {
    next();
  }

}

function validatePost(req, res, next) {
  // do your magic!
  const post = req.body;

  if (!post) {
    res.status(400).json({ message: 'missing post data' })
  } else if (!post.text) {
    res.status(400).json({ message: 'missing required text field' })
  } else {
    next();


}

module.exports = router;
