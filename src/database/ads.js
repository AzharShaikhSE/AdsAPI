const { getDatabase } = require('../database/mongodb');
const { ObjectId } = require('mongodb');

const collectionName = 'ads';

async function insertAds(ads) {
  const database = await getDatabase();
  const collection = database.collection(collectionName);
  await collection.insertMany(ads);
}

async function getAds() {
  const database = await getDatabase();
  const collection = database.collection(collectionName);
  return await collection.find({}).toArray();
}

async function getAd(id) {
  const database = await getDatabase();
  const collection = database.collection(collectionName);
  return await collection.findOne({ _id: new ObjectId(id) });
}

async function updateAd(id, ad) {
  const database = await getDatabase();
  const collection = database.collection(collectionName);
  await collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...ad,
      },
    }
  );
}

async function deleteAd(id) {
  const database = await getDatabase();
  const collection = database.collection(collectionName);
  await collection.deleteOne({ _id: new ObjectId(id) });
}

module.exports = {
  insertAds,
  getAds,
  getAd,
  updateAd,
  deleteAd,
};
