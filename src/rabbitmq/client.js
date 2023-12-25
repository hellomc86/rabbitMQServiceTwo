const amqp = require('amqplib');
const config = require("../config");
Producer= require("./producer");

class RabbitMQClientM2 {  
  isInitialized =false;  
  producer;
  consumer;
  connection;  
  producerChannel;
  consumerChannel;

  static getInstance() {
    if (!this.instance) {
      this.instance = new RabbitMQClientM2();
    }
    return this.instance;
  }
    
  async initialize() {
    if (this.isInitialized) {
      console.log("already initialized");
      return;
    }
    try {
      this.connection = await amqp.connect(config.rabbitMQ.url);

      this.producerChannel = await this.connection.createChannel();
      this.consumerChannel = await this.connection.createChannel();

      const { queue: mTwoQueue } = await this.consumerChannel.assertQueue(
        config.rabbitMQ.queues.mTwoQueue,
        { exclusive: true }
      );
      
      this.producer = new Producer(this.producerChannel);
      this.consumer = new Consumer(this.consumerChannel, mTwoQueue);

      this.consumer.consumeMessages();

      this.isInitialized = true;      
    } catch (error) {
      console.log("rabbitmq error...", error);
    }
  }
  async produce(data, correlationId, replyToQueue) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return await this.producer.produceMessages(
      data,
      correlationId,
      replyToQueue
    );
  }
}


module.exports = RabbitMQClientM2.getInstance();

Consumer= require("./consumer");