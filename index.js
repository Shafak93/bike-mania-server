const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//Middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res)=>{
    res.send('Running')
});


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PSS}@cluster0.axhwu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{
        await client.connect();
        const bikeCollection = client.db('bikeDB').collection('bike');

        //Get API : All Product
        app.get('/bike', async (req, res) =>{
            const query = {};
            const cursor = bikeCollection.find(query);
            const bikes = await cursor.toArray();
            res.send(bikes);
        })
        
        //Get API For individual Product
        app.get('/bike/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const bike = await bikeCollection.findOne(query);
            res.send(bike);
        })

        //PUT API : Update stock
        app.put('/bike/:id', async (req, res) =>{
            const id = req.params.id;
            const updatedStock = req.body;
            const filter = {_id : ObjectId(id)};
            const options = {upsert : true};
            const updateDoc = {
                $set: {
                    stock : updatedStock.stock 
                }
            };
            const result = await bikeCollection.updateOne(filter, updateDoc, options)
            res.send(result);
        })

        //POST API : Add Product
        app.post('/bike', async(req, res)=>{
            const newProduct = req.body;
            const result = await bikeCollection.insertOne(newProduct);
            res.send(result);
        })

        //Delete API : Remove product
        app.delete('/bike/:id', async(req, res) =>{
            const id = req.params.id;
        const query = {_id : ObjectId(id)};
        const result = await bikeCollection.deleteOne(query);
        res.send(result);
        })
    }
    finally{

    }
}
run().catch(console.dir);

app.listen(port,()=>{
    console.log('Running port ', port)
})