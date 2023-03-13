const { Schema, model } = require('mongoose');

const CoachSchema = new Schema({
  name: {
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
    required: true,
    model: {
      externalId: this.team,
    },
  },
});

module.exports = model('Coach', CoachSchema);
