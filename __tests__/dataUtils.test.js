const { updateWeightID } = require('../data/dataUtils.js');

describe('data utils', () => {

  test('finds the correct yarn weight ID for the yarn object, updates the yarn object to use the ID instead of a text string', async() => {
    const yarn_weights = [{
      weight: 'worsted',
      id: 1,
    },
    {
      weight: 'sport',
      id: 2,
    },
    {
      weight: 'fine',
      id: 3,
    },
    {
      weight: 'super-fine',
      id: 4,
    }
    ];
  
    const yarn = {
      name: 'Classic Wool',
      brand: 'Patons',
      material: 'wool',
      color: 'gray',
      quantity: 4,
      partials: true,
      weight_id: 'worsted',
    };
  
    const expectation = {
      name: 'Classic Wool',
      brand: 'Patons',
      material: 'wool',
      color: 'gray',
      quantity: 4,
      partials: true,
      weight_id: 1,
    };
  
    const actual = updateWeightID(yarn, yarn_weights);
  
    expect(actual).toEqual(expectation);
  });

});
