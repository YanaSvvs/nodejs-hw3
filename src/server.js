
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';

const PORT = process.env.PORT || 3030;

const app = express();
app.use(cors());
app.use(express.json());
app.use(pinoHttp({
  
  transport: {
    target: 'pino-pretty', 
  },
}));

app.get('/notes', (req, res) => {
  res.status(200).json({
    message: "Retrieved all notes",
  });
});

app.get('/notes/:noteId', (req, res) => {
  const noteId = req.params.noteId;
  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

app.get('/test-error', (req, res, next) => {
  throw new Error('Simulated server error');
});

app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {
 
  console.error('Unhandled error:', err.stack);
 
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    message: message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`Access at http://localhost:${PORT}`);
});