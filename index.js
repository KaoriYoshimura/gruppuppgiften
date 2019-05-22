import express from 'express';
import bodyParser from 'body-parser';
import Database from './lib/db';
import { cats, dogs, pokemons } from './creature.js'
// import { Creature } from './creatureClass.js'

// Setup the server
const PORT = 3000;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// // Test page to see console result
// app.get('/console',(req, res)=>{
//   res.send(pokemons);
// })

// Setup the database
const db = new Database();
db.addCollection('cats', cats);
db.addCollection('dogs', dogs);
db.addCollection('pokemons', pokemons);

class Creature {

    constructor(type, collection, app) {
      this.type = type;
      this.collection = collection;
      this.app = app;
    }
  
    registerPostCreature() {
      const path = `/${this.type}`;
      // console.log('regPost', path);
      this.app.post(path, (req, res) => {
          // body is animalobject, name is name property in object of animal
        if (!req.body.name) {
          console.log(req.body);
          return res.status(400).send({
            success: false,
            message: `Name is required for ${this.type}`,
          });
        }
        const newCreature = req.body;
        const newId = this.collection.push(newCreature);
        return res.status(201).send({
          success: true,
          message: `${this.type} added successfully`,
          id: newId,
        });
      });
    }
  
    registerGetAllCreatures() {
      const path = `/${this.type}s`;
      console.log('getPost', path);
  
      this.app.get(path, (req, res) => res.status(200).send({
        success: true,
        data: db[`${this.type}s`].all(),
      }));
    }
  
    registerGetCreatureById() {
      const path = `/${this.type}/:id`;
  
      this.app.get(path, (req, res) => {
        const id = +req.params.id;
        const result = db[`${this.type}s`].all().find(obj => obj.id === id);
        if (result) {
          return res.status(200).send({
            success: true,
            data: result,
          });
        }
        return res.status(404).send({
          success: false,
          message: `${this.type} could not be found`,
  
        });
      });
    }
  
    registerGetCreatureByStringInput() {
      const path = `/${this.type}s/:key/:value`;
  
      this.app.get(path, (req, res) => {
        const { key, value } = req.params;
        const result = db[`${this.type}s`].find({ [key]: value });
        if (result) {
          return res.status(200).send({
            success: true,
            data: result,
          });
        }
        return res.status(404).send({
          success: false,
          message: `${this.type}s not found`,
        });
      });
    }
  }


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
