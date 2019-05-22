import express from 'express';
import bodyParser from 'body-parser';
import Database from './lib/db';
import { cats, dogs, pokemons } from './creature.js'

// Setup the server
const PORT = 3000;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test page to see console result
app.get('/console',(req, res)=>{
  res.send(pokemons);
})

// Setup the database
const db = new Database();
db.addCollection('cats', cats);
db.addCollection('dogs', dogs);
db.addCollection('pokemons', pokemons);

// Setup the routes

function postAnimals(type, app) {
  app.post(`/${type}s`, (req, res) => {
    if (!req.body.name) {
      console.log(req.body);
      return res.status(400).send({
        success: false,
        message: 'Name is required for ' + `/${type}s`,
      });
    // eslint-disable-next-line no-else-return
    } else if (`/${type}s` === 'cats') {
      const newCat = req.body;
      const newId = db.cats.push(newCat);
      return res.status(201).send({
        success: true,
        message: 'Cat added successfully',
        id: newId,
      });
    }
  });
}

// Run postAnimals function
postAnimals('cat', app);
// postAnimals('dog', app, db.dogs);
// postAnimals('pokemon', app, db.pokemons);

app.post('/dog', (req, res) => {
  if (!req.body.name) {
    console.log(req.body);
    return res.status(400).send({
      success: false,
      message: 'Name is required for dog',
    });
  }
  const newdog = req.body;
  const newId = db.dogs.push(newdog);
  return res.status(201).send({
    success: true,
    message: 'Dog added successfully',
    id: newId,
  });
});

app.post('/pokemon', (req, res) => {
  if (!req.body.name) {
    console.log(req.body);
    return res.status(400).send({
      success: false,
      message: 'Name is required for pokemon',
    });
  }
  const newPokemon = req.body;
  const newId = db.pokemons.push(newPokemon);
  return res.status(201).send({
    success: true,
    message: 'Pokemon added successfully',
    id: newId,
  });
});


// Register data from database (Was app.get('/cats),(req,res)=>)
// eslint-disable-next-line no-shadow
function registerGetAnimals(type, app, collection) {
  app.get(`/${type}s`, (req, res) => res.status(200).send({
    success: true,
    data: collection.all(),
  }));
}

// Run registerGetAnimals function
registerGetAnimals('cat', app, db.cats);
registerGetAnimals('dog', app, db.dogs);
registerGetAnimals('pokemon', app, db.pokemons);


// const animals = [
//   {type: 'cat', collection: db.cats},
//   {type: 'dog', collection: db.dogs},
//   {type: 'pokemon', collection: db.pokemons},
// ];

// animals.forEach((animal) => {
//   registerGetAnimals(app, '/' + animal.type + 's', animal.collection);
// });

function getAnimalById(app, type) {
  app.get('/`${type}`/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const cat = db.cats.find({ id });
    if (cat) {
      return res.status(200).send({
        success: true,
        data: cat,
      });
    }
    return res.status(404).send({
      success: false,
      message: 'Cat not found',
    });
  });
}

getAnimalById(app, 'dog');

app.get('/cat/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const cat = db.cats.find({ id });
  if (cat) {
    return res.status(200).send({
      success: true,
      data: cat,
    });
  }
  return res.status(404).send({
    success: false,
    message: 'Cat not found',
  });
});

app.get('/catSearch/:key/:value', (req, res) => {
  const { key, value } = req.params;
  const cat = db.cats.find({ [key]: value });
  if (cat) {
    return res.status(200).send({
      success: true,
      data: cat,
    });
  }
  return res.status(404).send({
    success: false,
    message: 'Cat not found',
  });
});

app.get('/dogSearch/:key/:value', (req, res) => {
  const { key, value } = req.params;
  const dog = db.dogs.find({ [key]: value });
  if (dog) {
    return res.status(200).send({
      success: true,
      data: dog,
    });
  }
  return res.status(404).send({
    success: false,
    message: 'Dog not found',
  });
});

app.get('/pokemonSearch/:key/:value', (req, res) => {
  const { key, value } = req.params;
  const pokemon = db.pokemons.find({ [key]: value });
  if (pokemon) {
    return res.status(200).send({
      success: true,
      data: pokemon,
    });
  }
  return res.status(404).send({
    success: false,
    message: 'pokemon not found',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});
