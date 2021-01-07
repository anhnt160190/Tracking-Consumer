const { Schema, model } = require('mongoose');

const GpsSchema = new Schema(
  {
    lat: Number,
    lng: Number,
  },
  { timestamps: true }
);

module.exports = model('gps', GpsSchema);
