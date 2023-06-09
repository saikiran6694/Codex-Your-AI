import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const port = process.env.PORT || 9002;

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.get("/", async (req, res) => {
  res.status(200).send({ message: "Hello to OpenAI" });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error || "Something went wrong");
  }
});

app.listen(port, () => console.log(`Server running on ${port}`));
