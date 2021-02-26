const client = require('../lib/client');
// import our seed data:
const yarns = require('./yarns.js');
const usersData = require('./users.js');
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

    await Promise.all(
      yarns.map(yarn => {
        return client.query(`
                    INSERT INTO yarns (name, brand, material, color, yarn_weight, quantity, partials, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
                `,
        [yarn.name, 
          yarn.brand, 
          yarn.material, 
          yarn.color, 
          yarn.yarn_weight, 
          yarn.quantity, 
          yarn.partials, 
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
