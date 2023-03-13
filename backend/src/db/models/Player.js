const { Schema, model } = require('mongoose');

const PlayerSchema = new Schema({
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
  position: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  nationality: {
    type: String,
  },
  teamName: {
    type: String,
    required: true,
  },
  team: {
    type: Number,
    ref: 'Team',
    match: {
      externalId: this.team,
    },
    required: true,
  },
});

module.exports = model('Player', PlayerSchema);
