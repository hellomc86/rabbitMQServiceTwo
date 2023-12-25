const instance  = require("./rabbitmq/client");
class RequestHandlerM2 {
    static async handle(correlationId, replyTo, data ) {
        let response = {};       
        const { num } = data;
        response = num * 2; 
        await setTimeout(() => {
           instance.produce(response, correlationId, replyTo);          
        }, 5000);
        
      }
  }
  module.exports = RequestHandlerM2;

  