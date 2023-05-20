const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kpjgmam.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const toyCollection = client.db('carsDB').collection('cars');

        // indexing
        const indexKeys = { name: 1 };
        const indexOptions = { name: "carName" };
        await toyCollection.createIndex(indexKeys, indexOptions);

        app.get("/searchByName/:text", async (req, res) => {
            const searchText = req.params.text;
            const result = await toyCollection.find({ name: { $regex: searchText, $options: "i" } }).toArray();
            res.send(result);
        });

        // add and get
        //get all or use limit
        app.get('/all-toys', async (req, res) => {
            const limit = parseInt(req.query.limit);
            let cursor;

            if (limit) {
                cursor = toyCollection.find().limit(limit);
            } else {
                cursor = toyCollection.find();
            }
            const result = await cursor.toArray();
            res.send(result);
        });

        //specific one
        app.get('/all-toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query);
            res.send(result);
        });

        // get some
        app.get('/toys-by-email', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await toyCollection.find(query).toArray();
            res.send(result);
        });

        // add a new toy car
        app.post('/all-toys', async (req, res) => {
            const newToy = req.body;
            const result = await toyCollection.insertOne(newToy);
            res.send(result);
        });
        // put
        app.put('/all-toys/:id', async (req, res) => {
            const id = req.params.id;
            const toy = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedToy = {
                $set: {
                    name: toy.name,
                    picture: toy.picture,
                    seller: toy.seller,
                    email: toy.email,
                    category: toy.category,
                    price: toy.price,
                    rating: toy.rating,
                    quantity: toy.quantity,
                    description: toy.description
                }
            }
            const result = await toyCollection.updateOne(filter, updatedToy, options);
            res.send(result);
        });

        // delete 
        app.delete('/all-toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query);
            res.send(result);
        });
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("MINI WHEELS SERVER IS RUNNING")
});

app.listen(port, () => {
    console.log(`MINI WHEELS SERVER IS RUNNING ON PORT: ${port}`);
});