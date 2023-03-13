const { Schema, model } = require('mongoose');

const CompetitionSchema = new Schema({
  externalId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
    nullable: false,
  },
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  areaName: {
    type: String,
    required: true,
  },
});

module.exports = model('Competition', CompetitionSchema);
