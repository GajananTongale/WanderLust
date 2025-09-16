const mongoose = require("mongoose");
const {initData} = require("./data");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://localhost:27017/wanderlust";

main().then(() => {
    console.log("Connected!");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}


const initDB = async () => {
    await Listing.deleteMany({});
    const listingsWithOwner = initData.map((obj) => ({
        ...obj,
        owner: "68b433589140a1106c80904f"
    }));    await Listing.insertMany(listingsWithOwner);
    console.log("Listing inserted!");
};

initDB()