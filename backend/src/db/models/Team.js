const { Schema, model } = require('mongoose');

const TeamSchema = new Schema({
  externalId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  tla: {
    type: String,
    required: true,
  },
  shortName: {
    type: String,
    required: true,
  },
  areaName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  competitions: [
    {
      type: Number,
      ref: 'Competition',
      match: {
        externalId: this.competitions,
      },
    },
  ],
});

module.exports = model('Team', TeamSchema);
