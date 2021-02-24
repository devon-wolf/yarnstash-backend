const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/yarns', async(req, res) => {
  try {
    const data = await client.query(`
    SELECT 
      yarns.id,
      yarns.name,
      yarns.brand,
      yarns.material,
      yarns.color,
      yarns.quantity,
      yarns.partials,
      yarn_weights.weight as weight,
      yarns.weight_id,
      yarns.owner_id
    from yarns
    JOIN yarn_weights
    ON yarns.weight_id = yarn_weights.id
    ORDER BY yarns.id
    `);

    res.json(data.rows);

  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/yarn_weights', async(req, res) => {
  try {
    const data = await client.query('SELECT * from yarn_weights');
    
    res.json(data.rows);

  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/yarns/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const data = await client.query(`
    SELECT
      yarns.id,
      yarns.name,
      yarns.brand,
      yarns.material,
      yarns.color,
      yarns.quantity,
      yarns.partials,
      yarn_weights.weight as weight,
      yarns.weight_id,
      yarns.owner_id
    from yarns 
    JOIN yarn_weights
    ON yarns.weight_id = yarn_weights.id
    where yarns.id=$1`, [id]);

    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/yarns', async(req, res) => {
  try {
    const data = await client.query(
      `INSERT into yarns (name, brand, material, color, quantity, partials, weight_id, owner_id)
      values ($1, $2, $3, $4, $5, $6, $7, $8)
      returning *`,
      [
        req.body.name,
        req.body.brand,
        req.body.material,
        req.body.color,
        req.body.quantity,
        req.body.partials,
        req.body.weight_id,
        1
      ]);

    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/yarns/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const data = await client.query('DELETE from yarns where id=$1 returning *', [id]);

    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/yarns/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const data = await client.query(
      `UPDATE yarns
      SET name = $1, brand = $2, material = $3, color = $4, quantity = $5, partials = $6, weight_id = $7
      WHERE id=$8
      returning *;`,
      [
        req.body.name,
        req.body.brand,
        req.body.material,
        req.body.color,
        req.body.quantity,
        req.body.partials,
        req.body.weight_id,
        id
      ]);

    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
