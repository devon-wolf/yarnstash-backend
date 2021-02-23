function getWeightID(yarn, yarn_weights) {

  const weightMatch = yarn_weights.find(i => i.weight === yarn.weight_id);

  return weightMatch.id;
}

function updateWeightID(yarn, yarn_weights) {
  const correctID = getWeightID(yarn, yarn_weights);
  yarn.weight_id = correctID;
  return yarn;
}

module.exports = { updateWeightID };
