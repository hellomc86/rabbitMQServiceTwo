
const RequestHandlerM2 = require("../reqHandler");
class Consumer {
    constructor(
        channel,
        mTwoQueueName        
      ) {
        this.channel = channel;
        this.mTwoQueueName = mTwoQueueName;        
      }
  async consumeMessages() {
    console.log("Ready to consume messages...");

    this.channel.consume(
        this.mTwoQueueName,
      async (message) => {
        const { correlationId, replyTo } = message.properties;        
        if (!correlationId || !replyTo) {
          console.log("Missing some properties...");
        }
        console.log("Consumed", JSON.parse(message.content.toString()));
        return await RequestHandlerM2.handle( correlationId, replyTo, 
          JSON.parse(message.content.toString())          
        );
      },
      {
        noAck: true,
      }
    );
  }
}

module.exports = Consumer;



