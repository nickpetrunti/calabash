import {MongoClient} from "mongodb";
import config from "./config.json" with {type: "json"}

const url = config.databaseURL;

const mongoClient = new MongoClient(url);
const db = mongoClient.db(config.databaseName)

async function fetchDatabase(collectionName) {
    return db.collection(collectionName);
}

export default {fetchDatabase};