class Creature {
  constructor(type, collection, app, db) {
    this.type = type;
    this.collection = collection;
    this.app = app;
    this.db = db;
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

      data: this.db[`${this.type}s`].all(),
    }));
  }

  registerGetCreatureById() {
    const path = `/${this.type}/:id`;

    this.app.get(path, (req, res) => {
      const id = +req.params.id;

      const result = this.db[`${this.type}s`].all().find(obj => obj.id === id);
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
      const result = this.db[`${this.type}s`].find({ [key]: value });
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

export default Creature;
