const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uqsst.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client
      .db("biker-inventory")
      .collection("product");
    app.get("/products", async (req, res) => {
      const products = await productCollection.find({}).toArray();
      res.send(products);
    });
    app.post("/products", async (req, res) => {
      const result = await productCollection.insertOne(req.body);
      res.send(result);
    });
    app.get("/product/:id", async (req, res) => {
      console.log(req.params.id);
      const products = await productCollection.findOne({
        _id: ObjectId(req.params.id),
      });
      res.send(products);
    });
    app.put("/product/:id", async (req, res) => {
      console.log(req.body);
      const update = req.body;
      const filter = { _id: ObjectId(req.params.id) };
      const option = { upsert: true };
      const updateProduct = {
        $set: {
          quantity: update.quantity,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updateProduct,
        option
      );
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  const hi = "hello Biker, What's up?";
  res.send(hi);
});
app.listen(port, () => {
  console.log("port running ", port);
});
