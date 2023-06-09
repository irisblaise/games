const express = require("express");
const Replicate = require("replicate");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

app.post("/api/replicate", async (req, res) => {
  try {
    const { modelName, input } = req.body;
    console.log({modelName})
    console.log({input})
    const result = await replicate.run(modelName, { input });
    console.log('Result is: ')
    console.log(result)
    res.json({result});
  } catch (error) {
    console.log('error')
    console.error(error);
    res.status(500).json({ error: "Failed to call Replicate API" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});