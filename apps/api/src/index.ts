import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import type { CreateRepoRequest } from '@repo/contracts';

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Hello from the API!');
});

app.post('/repo', (req, res) => {
  const { repoName } = req.body as CreateRepoRequest;
  console.log('repoName:', repoName);
  res.status(200).send({ message: 'Success' });
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
