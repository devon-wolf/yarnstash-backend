const client = require('../lib/client');
// import our seed data:
const yarns = require('./yarns.js');
const usersData = require('./users.js');
const weightsData = require('./yarn_weights.js');
const { updateWeightID } = require('./dataUtils.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
    
    const user = users[0].rows[0];
    
    const yarn_weights = await Promise.all(
      weightsData.map(weightObj => {
        return client.query(`
                      INSERT INTO yarn_weights (weight)
                      VALUES ($1)
                      RETURNING *;
                  `,
        [weightObj.weight]);
      })
    );
      
    const weights = yarn_weights.map(({ rows }) => rows[0]);

    await Promise.all(
      yarns.map(yarn => {
        const updatedYarn = updateWeightID(yarn, weights);

        return client.query(`
                    INSERT INTO yarns (name, brand, material, color, quantity, partials, weight_id, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
                `,
        [updatedYarn.name, 
          updatedYarn.brand, 
          updatedYarn.material, 
          updatedYarn.color, 
          updatedYarn.quantity, 
          updatedYarn.partials, 
          updatedYarn.weight_id,
          user.id]);
      })
    );
    
    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
