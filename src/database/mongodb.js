const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

let database = null;

// Create a new MongoDB instance
async function startDatabase() {
  console.log('Starting database...');
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();
  const connection = await MongoClient.connect(mongoUri, { useNewUrlParser: true });
  database = connection.db();
}

// get the database instance
async function getDatabase() {
  // console.log('Getting database instance...', database);
  if (!database) {
    await startDatabase();
  }
  return database;
}

module.exports = {
  getDatabase,
  startDatabase,
};
