import express from 'express';
import bodyParser from 'body-parser';
import Database from './lib/db';
import { cats, dogs, pokemons } from './creature';
import Creature from './creatureClass';

// Setup the server
const PORT = 3000;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// // Test page to see console result
// app.get('/console',(req, res)=>{
//   res.send(pokemons);
// })

// Setup the database
const db = new Database();
db.addCollection('cats', cats);
db.addCollection('dogs', dogs);
db.addCollection('pokemons', pokemons);


const cat = new Creature('cat', db.cats, app);
cat.registerPostCreature();
cat.registerGetAllCreatures();
cat.registerGetCreatureById();
cat.registerGetCreatureByStringInput();

const dog = new Creature('dog', db.dogs, app);
dog.registerPostCreature();
dog.registerGetAllCreatures();
dog.registerGetCreatureById();
dog.registerGetCreatureByStringInput();

const pokemon = new Creature('pokemon', db.pokemons, app);
pokemon.registerPostCreature();
pokemon.registerGetAllCreatures();
pokemon.registerGetCreatureById();
pokemon.registerGetCreatureByStringInput();


// Start server
app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});
