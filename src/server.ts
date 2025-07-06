import express from 'express';
import routes from './routes';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path'

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/downloads', express.static(path.join(__dirname, '../binaries')));

app.get('/download/unwanted-virtual-units', (req, res) => {
  const filePath = path.join(__dirname, '../binaries/UnwantedVirtualUnits.exe');
  res.download(filePath, 'UnwantedVirtualUnits.exe', (err) => {
    if (err) {
      console.error('Download error:', err);
      res.status(404).send('File not found');
    }
  });
});

// Routes
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
