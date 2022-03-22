const express = require('express'),
      morgan = require('morgan');

const app = express();
const bodyParser = require('body-parser'),
      methodOverride = require('method-override');
      
app.use(morgan('common'));

let topMovies = [
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

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname});
});

app.use(express.static('public'));

// error handling 
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error!');
});

// listen for requests 
app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});
