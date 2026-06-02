const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
dotenv.config();
const uri = process.env.MONGODB_URI;
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // await client.connect();

    const db = client.db("sportnest");
    const facilityCollection = db.collection("facilities");

    const bookingCollection = db.collection("bookings");

    app.post("/booking", async (req, res) => {
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData);
      res.json(result);
    });

    app.get("/booking/:email", async (req, res) => {
      // console.log(email, "email");
      const { email } = req.params;
      const result = await bookingCollection
        .find({
          user_email: email,
        })
        .toArray();
      res.json(result);
    });

    app.get("/facility", async (req, res) => {
      const result = await facilityCollection.find().toArray();
      res.json(result);
    });

    app.get("/facility/:id", async (req, res) => {
      const { id } = await req.params;
      const result = await facilityCollection.findOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });
    app.post("/facility", async (req, res) => {
      const facilityData = req.body;
      // console.log(facilityData, "Facility data");
      const result = await facilityCollection.insertOne(facilityData);
      res.json(result);
    });

    app.patch("/facility/:id", async (req, res) => {
      const { id } = await req.params;

      const updatedData = await req.body;

      const result = await facilityCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        { $set: updatedData },
      );
      res.json(result);
    });

    app.delete("/facility/:id", async (req, res) => {
      const { id } = await req.params;

      const result = await facilityCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running fine.");
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
