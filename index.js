require('dotenv').config(); 
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

let usersCollection; 

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

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const db = client.db("sample_mflix");
    usersCollection = db.collection("users");

  } catch (err){
    console.log('Something went wrong: ' + err);
  }
}
run().catch(console.dir);

// Get all users 
app.get('/users', async (req, res) => {
  try{
    const users = await usersCollection.find().toArray();
    res.json(users);
  } catch (err){
    res.status(500).json({ error: "Failed to fetch users" });
    console.log(err);
  }
});

// Create a user 
app.post('/users', async (req, res) => {
  try{
    const newUser = req.body // New user data comes from the request body
    const result = await usersCollection.insertOne(newUser);

    res.status(201).json(result);
  } catch (err){
    res.status(500).write('Something went wrong: ' + err);
    console.log(err);
  }
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
