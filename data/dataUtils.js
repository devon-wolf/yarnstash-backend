// search an array of yarn objects to find the ID of the object whose 'weight' value matches the yarn's 'weight_id' value; return the ID
const getWeightID = (yarn, yarn_weights) => yarn_weights.find(i => i.weight === yarn.weight_id).id;

// update a yarn object to use the correct ID from the yarn_weights data as its 'weight_id' value
function updateWeightID(yarn, yarn_weights) {
  yarn.weight_id = getWeightID(yarn, yarn_weights);
  return yarn;
}

module.exports = { updateWeightID };
