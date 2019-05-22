// To use this database:
// Add a collection and with a name to it (this collection has to be an array)
// To access the collection, just use its name, eg `db.users.find({name: 'filip'})`

// The collection has three commands:
// - all() returns the entire collection
// - find({}) return the first object in the collection the matches all the
//     properties given
// - push(item) adds one more object to the collection, and returns its id

class Collection {
  constructor(collection = []) {
    if (!Array.isArray(collection)) {
      throw new Error('Illegal argument to Collection - expected array');
    }
    // Add an id to every element in the collection - for the sake of convenience - it's the index
    this.collection = collection.map((item, index) => ({ ...item, id: index }));
  }

  all() {
    return this.collection;
  }

  find(query) {
    if (typeof query !== 'object') {
      throw new Error('Illegal argument to Collection.find - expected object');
    }
    return this.collection.find((item) => {
      const queryKeys = Object.keys(query);
      for (let i = 0; i < queryKeys.length; i += 1) {
        const key = queryKeys[i];
        if (query[key] !== item[key]) {
          return false;
        }
      }
      return true;
    });
  }

  delete(id) {
    this.collection[id] = { };
  }

  push(item) {
    // Remember to add an id for the item
    const newId = this.collection.length;
    this.collection.push({ ...item, id: newId });
    return newId;
  }
}

  class Db {
  constructor() {
    this.collections = [];
  }

  addCollection(name, collection) {
    this[name] = new Collection(collection);
    this.collections.push(name);
  }
}

export default Db;
