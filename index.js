const { Kafka } = require('kafkajs');
const mongoose = require('mongoose');
const gps = require('./models/gps');
const Gps = require('./models/gps');
const {
  CarPercent,
  CarColor,
  CarDestiny,
  Accident,
} = require('./models/chart');

const Keys = {
  KAFKA_BROKER: process.env.KAFKA_BROKER || 'kafka:9092',
  KAFKA_TOPIC: process.env.KAFKA_TOPIC || 'topic_01',
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/tracking',
};

const ConnectDB = async () => {
  try {
    await mongoose.connect(Keys.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('CONNECT DB');
  } catch (error) {
    console.log(`MONGODB Connect Error ${error}`);
  }
};

const kafka = new Kafka({
  clientId: 'save_data',
  brokers: [Keys.KAFKA_BROKER],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: '1' });

const ReadKafkaAndSaveToDB = async () => {
  await ConnectDB();
  await consumer.connect();
  await consumer.subscribe({ topic: Keys.KAFKA_TOPIC, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`receive data at: ${new Date()} with data: ${message.value}`);
      await Promise.all([SaveGps(message.value), FakeStatistic()]);
    },
  });
};

const SaveGps = async (gps) => {
  const newGps = new Gps(gps);
  await newGps.save();
};

const FakeStatistic = async () => {
  await Promise.all([
    FakeCarPercent(),
    FakeCarColor(),
    FakeCarDestiny(),
    FakeAccident(),
  ]);
};

const FakeCarPercent = async () => {
  const newCarPercent = new CarPercent({
    car: GetRandomInt(0, 100),
    mortobike: GetRandomInt(100, 500),
    bus: GetRandomInt(0, 100),
    bike: GetRandomInt(0, 100),
    walk: GetRandomInt(0, 100),
    others: GetRandomInt(30, 100),
  });
  await newCarPercent.save();
};

const FakeCarColor = async () => {
  const newCarColor = new CarColor({
    black: GetRandomInt(0, 100),
    white: GetRandomInt(0, 100),
    blue: GetRandomInt(0, 100),
    red: GetRandomInt(0, 100),
    others: GetRandomInt(0, 100),
  });
  await newCarColor.save();
};

const FakeCarDestiny = async () => {
  const now = new Date();
  const newCarDestiny = new CarDestiny({
    total: GetRandomInt(0, 100),
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });
  await newCarDestiny.save();
};

const FakeAccident = async () => {
  const now = new Date();
  const newAccident = new Accident({
    total: GetRandomInt(0, 10),
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });
  await newAccident.save();
};

const GetRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

ReadKafkaAndSaveToDB();
