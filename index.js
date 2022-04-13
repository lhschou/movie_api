const express = require('express'),
      morgan = require('morgan');

const app = express();
const bodyParser = require('body-parser'),
      uuid = require('uuid');

const mongoose =require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.Users;

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/myFlixDB', {
useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send('Welcome to MyFlix!');
});

// Gets list of movies
app.get('/movies', (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(200).json(movies);
  })
  .catch((err) => {
    res.status(500).send('Error: ' + err);
  });
});

// Gets single movie by title
app.get('/movies/:title', (req, res) => {
  Movies.findOne({Title: req.params.title})
    .then((movie) => {
      if(movie){
        res.status(200).json(movie);
      } else {
        res.status(400).sendStatus('Movie not found.');
      };
    })
    .catch((err) => {
      res.status(500).send('Error ' + err);
    });
});

// Gets data about a genre 
app.get('/movies/genre/:Name', (req, res) => {
  Movies.findOne({'Genre.Name': req.params.Name})
    .then((movie) => {
      if(movie){
        res.status(200).json(movie.Genre);
      };
    })
    .catch((err) => {
      res.status(500).send('Error ' + err);
    });
});

// Gets data about a director
app.get('/movies/director/:Name', (req, res) => {
  Movies.findOne({'Director.Name': req.params.Name})
    .then((movie) => {
      if(movie){
        res.status(200).json(movie.Director);
      }else{
        res.status(400).send('Director not found.');
      };
    })
    .catch((err) => {
      res.status(500).send('Error ' + err);
    });
});

// Creates a new user 
/* JSON in this format {
  ID: integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date,
}*/
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users 
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => {res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Get all users 
app.get('/users', (req,res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Update user info
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, 
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Adds movie to list of user favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Removes movies from list of user favorites
app.delete('/users/:Username/movies/:MovieID', (req,res) => {
  Users.findOneAndUpdate({Username: req.params.Username},
    {$pull: {FavoriteMovies: req.params.MovieID}},
    { new: true})//returns updated document
    .then((updatedUser) => {
      res.json(updatedUser); //returns json object of updated user
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

// Delete a user by username
app.delete('/users/:Username', (req,res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Read documentation
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname});
});

app.use(express.static('public'));

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});