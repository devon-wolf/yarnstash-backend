require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

// const { updateWeightID } = require('../data/dataUtils.js');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns yarns', async() => {

      const expectation = [
        {
          'id': 1,
          'name': 'Cakes',
          'brand': 'Caron',
          'material': 'blend (acrylic-wool)',
          'color': 'multi',
          'quantity': 2,
          'partials': true,
          'weight_id': 1,
          'owner_id': 1
        },
        {
          'id': 2,
          'name': 'Sugar \'N Cream',
          'brand': 'Lily',
          'material': 'cotton',
          'color': 'purple',
          'quantity': 3,
          'partials': true,
          'weight_id': 1,
          'owner_id': 1
        },
        {
          'id': 3,
          'name': 'Grace',
          'brand': 'Patons',
          'material': 'cotton (mercerized)',
          'color': 'green',
          'quantity': 3,
          'partials': false,
          'weight_id': 2,
          'owner_id': 1
        },
        {
          'id': 4,
          'name': 'Kroy Socks',
          'brand': 'Patons',
          'material': 'blend (wool-nylon)',
          'color': 'pink-multi',
          'quantity': 2,
          'partials': true,
          'weight_id': 4,
          'owner_id': 1
        },
        {
          'id': 5,
          'name': 'Wool-Ease',
          'brand': 'Lion',
          'material': 'blend (acrylic-wool)',
          'color': 'brown',
          'quantity': 1,
          'partials': false,
          'weight_id': 1,
          'owner_id': 1
        },
        {
          'id': 6,
          'name': 'Classic Wool',
          'brand': 'Patons',
          'material': 'wool',
          'color': 'gray',
          'quantity': 4,
          'partials': true,
          'weight_id': 1,
          'owner_id': 1
        }
      ];

      const data = await fakeRequest(app)
        .get('/yarns')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('returns one yarn by id', async() => {

      const expectation = {
        'id': 5,
        'name': 'Wool-Ease',
        'brand': 'Lion',
        'material': 'blend (acrylic-wool)',
        'color': 'brown',
        'quantity': 1,
        'partials': false,
        'weight_id': 1,
        'owner_id': 1
      };

      const data = await fakeRequest(app)
        .get('/yarns/5')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('adds a new yarn', async() => {
      const newYarn = {
        'name': 'Dazzle',
        'brand': 'Caron',
        'material': 'blend (acrylic-nylon)',
        'color': 'yellow',
        'quantity': 1,
        'partials': false,
        'weight_id': 2
      };

      const expectation = {
        ...newYarn,
        id: 7,
        owner_id: 1
      };

      const data = await fakeRequest(app)
        .post('/yarns')
        .send(newYarn)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('deletes a yarn by its id', async() => {
      const expectation = {
        'id': 5,
        'name': 'Wool-Ease',
        'brand': 'Lion',
        'material': 'blend (acrylic-wool)',
        'color': 'brown',
        'quantity': 1,
        'partials': false,
        'weight_id': 1,
        'owner_id': 1
      };

      const data = await fakeRequest(app)
        .delete('/yarns/5')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);

      const noYarnHere = await fakeRequest(app)
        .get('/yarns/5')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(noYarnHere.body).toEqual('');
    });

    test('updates a yarn by its id', async() => {
      const updatedYarn = {
        'name': 'Cakes',
        'brand': 'Caron',
        'material': 'blend (acrylic-wool)',
        'color': 'blue-multi',
        'quantity': 2,
        'partials': true,
        'weight_id': 1
      };

      const expectation = {
        ...updatedYarn,
        id: 1,
        owner_id: 1
      };

      const data = await fakeRequest(app)
        .put('/yarns/1')
        .send(updatedYarn)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    // test('finds the correct yarn weight ID for the yarn object, updates the yarn object to use the ID instead of a text string', async() => {
    //   const yarn_weights = [{
    //     weight: 'worsted',
    //     id: 1,
    //   },
    //   {
    //     weight: 'sport',
    //     id: 2,
    //   },
    //   {
    //     weight: 'fine',
    //     id: 3,
    //   },
    //   {
    //     weight: 'super-fine',
    //     id: 4,
    //   }
    //   ];

    //   const yarn = {
    //     name: 'Classic Wool',
    //     brand: 'Patons',
    //     material: 'wool',
    //     color: 'gray',
    //     quantity: 4,
    //     partials: true,
    //     weight_id: 'worsted',
    //   };

    //   const expectation = {
    //     name: 'Classic Wool',
    //     brand: 'Patons',
    //     material: 'wool',
    //     color: 'gray',
    //     quantity: 4,
    //     partials: true,
    //     weight_id: 1,
    //   };

    //   const actual = updateWeightID(yarn, yarn_weights);

    //   expect(actual).toEqual(expectation);
    // });

  });
});
