const { Schema, model } = require('mongoose');

const CarPercentSchema = new Schema(
  {
    car: Number,
    motorbike: Number,
    bus: Number,
    bike: Number,
    walk: Number,
    others: Number,
  },
  { timestamps: true }
);

exports.CarPercent = model('car_percent', CarPercentSchema);

const CarColorSchema = new Schema(
  {
    black: Number,
    white: Number,
    blue: Number,
    red: Number,
    others: Number,
  },
  { timestamps: true }
);

exports.CarColor = model('car_color', CarColorSchema);

const CarDestinySchema = new Schema(
  {
    year: Number,
    month: Number,
    total: Number,
  },
  { timestamps: true }
);

exports.CarDestiny = model('car_destiny', CarDestinySchema);

const AccidentSchema = new Schema(
  {
    year: Number,
    month: Number,
    total: Number,
  },
  { timestamps: true }
);

exports.Accident = model('accident', AccidentSchema);
