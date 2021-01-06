const { Kafka } = require('kafkajs');

const Keys = {
  KAFKA_BROKER: process.env.KAFKA_BROKER || 'kafka:9092',
  KAFKA_TOPIC: process.env.KAFKA_TOPIC || 'topic_01',
};

const kafka = new Kafka({
  clientId: 'save_data',
  brokers: [Keys.KAFKA_BROKER],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: '1' });

const ReadKafkaAndSaveToDB = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: Keys.KAFKA_TOPIC, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`receive data at: ${new Date()} with data: ${message.value}`);
    },
  });
};

ReadKafkaAndSaveToDB();
