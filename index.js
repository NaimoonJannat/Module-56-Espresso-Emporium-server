const express = require('express')
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000

// middleware 
app.use(cors({
  origin: ['http://localhost:5173','https://coffee-shop-4c45d.web.app'], credentials: true
}));
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3ywizof.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

  
        // to send data to database 
    // const coffeeCollection = client.db('coffeeDB').collection('coffee');
    const database = client.db('coffeeDB');
    const coffeeCollection = database.collection("coffee");

    // to update coffee cards 
    app.get('/coffee/:id', async(req, res)=>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    app.put('/coffee/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedCoffee = req.body;
      const Coffee = {
        $set: {
          name: updatedCoffee.name, 
          chef: updatedCoffee.chef, category: updatedCoffee.category, 
          details: updatedCoffee.details, photo: updatedCoffee.photo,
        }
      }
      const result = await coffeeCollection.updateOne(filter,Coffee);
      res.send(result);
    })

    // to see the coffee cards 
    app.get('/coffee', async(req, res)=>{
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/coffee', async(req, res)=>{
      const newCoffee = req.body;
      console.log(newCoffee); 
      const result = await  coffeeCollection.insertOne(newCoffee);
      res.send(result);
    })

    // delete a card 
    app.delete('/coffee/:id', async(req, res) =>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);


app.get('/', (req, res) => {
  res.send('Coffee making Server Running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})