const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'size',
  password: 'desoxi',
  port: 5432,
});

app.use(cors({
  origin: 'https://tuusuario.github.io'
}));
app.use(bodyParser.json());

app.post('/find-size', async (req, res) => {
  const { waist, hip } = req.body;
  try {
    const result = await pool.query(
      'SELECT size_name FROM sizes WHERE $1 BETWEEN min_waist AND max_waist AND $2 BETWEEN min_hip AND max_hip',
      [waist, hip]
    );
    if (result.rows.length > 0) {
      res.status(200).json({ size: result.rows[0].size_name });
    } else {
      res.status(404).json({ error: 'No matching size found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
