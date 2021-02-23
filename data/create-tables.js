const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(256) NOT NULL,
                    hash VARCHAR(512) NOT NULL
                );           
                CREATE TABLE yarns (
                    id SERIAL PRIMARY KEY NOT NULL,
                    name VARCHAR(512) NOT NULL,
                    brand VARCHAR(512) NOT NULL,
                    material VARCHAR(512) NOT NULL,
                    color VARCHAR(512) NOT NULL,
                    quantity INTEGER NOT NULL,
                    partials BOOLEAN NOT NULL,
                    weight_id INTEGER NOT NULL REFERENCES yarn_weights(id),
                    owner_id INTEGER NOT NULL REFERENCES users(id)
                );
                CREATE TABLE yarn_weights(
                  id SERIAL PRIMARY KEY NOT NULL,
                  weight VARCHAR(512) NOT NULL
                )
    `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
