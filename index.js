const express = require('express'),
      morgan = require('morgan');

const app = express();
const bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      uuid = require('uuid');
      
app.use(morgan('common'));
app.use(bodyParser.json());

let users = [
  {
  username: 'lhs',
  email: 'lhschou1@gmail.com',
  password: 'jslsjd',
  birthday: '14/06/1996',
  favoriteMovies: []
  },
]

let movies = [
  {
    title:'The Shawshank Redemption',
    year:'1994'
  },
  {
    title:'The Godfather',
    year:'1972'
  },
  {
    title:'The Dark Knight',
    year:'2008'
  },
  {
    title:'The Godfather: Part II',
    year:'1974'
  },
  {
    title:'12 Angry Men',
    year:'1957'
  },
  {
    title:'Schindler\'s List',
    year:'1993'
  },
  {
    title:'The Lord of the Rings: The Return of the King',
    year:'2003'
  },
  {
    title:'Pulp Fiction',
    year:'1994'
  },
  {
    title:'The Lord of the Rings: The Fellowship of the Ring',
    year:'2001'
  },
  {
    title:'The Good, the Bad and the Ugly',
    year:'1966'
  },
];

//GET requests 
app.get('/', (req, res) => {
  res.send('Welcome to MyFlix!');
});

// Gets list of movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

// Gets single movie by title
app.get('/movies/:title', (req, res) => {
  const { title } = req.params; 
  const movie = movie.find((movie) => movie.Title === title); 

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404).send('Movie not found!');
  }
});

// Gets data about a genre 
app.get('/movies/genres/:genre', (req, res) => {
  const genre = movies.find((movie) => movie.genre.name === req.params.genre).genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(404).send('Genre not found!');
  }
});

// Gets data about a director
app.get('/movies/directors/:name', (req, res) => {
  const director = movies.find((movie) => movie.director.name === req.params.name).director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(404).send('Director not found.')
  }
});

// Creates a new user 
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (!newUser.username) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser)
  } else {
    const message = 'Missing username in request body';
    res.status(400).send(message);
  };
});

// Update user info
app.put('/users/:username', (req, res) => {
  const newUsername = req.body;

  let user = user.find((user) => { return user.username === req.params.username });

  if (user) {
    user.username = newUsername.username;
    res.status(200).json(user);
  } else {
    res.status(404).send('Username not found!');
  }
});

// Adds movie to list of user favorites
app.post('/users/:username/:movie', (req, res) => {
  let user = users.find((user) => {return user.username === req.params.username});

  if (user) {
    user.favorites.push(req.params.movie);
    res.status(200).send(req.params.movie + ' was added to ' + user.username + "'s favorite movies.");
  } else {
    res.status(400).send('User not found!')
  };
});

// Removes movies from list of user favorites
app.delete('/users/:username/:movie', (req, res) => {
  let user = users.find((user) => { return user.username === req.params.username });

  if (user) {
    user.favorites = user.favorites.filter((mov) => { return mov !== req.params.movie });
    res.status(200).send(req.params.movie + ' was removed from ' + user.username + "'s favorite movies.");
  } else {
    res.status(400).send('User not found!')
  };

});

// Removes user 
app.delete('/users/:username', (req, res) => {
  let user = users.find((user) => { return user.username === req.params.username });

  if (user) {
    users = user.filter((user) => { return user.username !== req.params.username });
    res.status(201).send(req.params.username + ' was deleted!');
  } else {
    res.status(400).send('User not found!')
  };
});

// Read documentation
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname});
});

app.use(express.static('public'));

// error handling 
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error!');
});

// listen for requests 
app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});
