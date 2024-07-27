const { ServiceBusClient } = require("@azure/service-bus");
const config = require("../config/config");

// connection string to your Service Bus namespace
const connectionString = config.serviceBus.connectionString;

// name of your Service Bus queue
const queueName = "compress-video";

async function sendMessageServiceBus(message) {
  // create a Service Bus client using the connection string to the Service Bus namespace
  const sbClient = new ServiceBusClient(connectionString);
    console.log(connectionString)
  // createSender() takes the name of the queue as a parameter
  const sender = sbClient.createSender(queueName);

  try {
    // Tries to send a message to the Service Bus queue
    await sender.sendMessages({
      body: "Hello, World!"
    });

    console.log(`Sent a single message to the queue: ${queueName}`);
  } catch (err) {
    console.log(`Error when sending message to the queue: ${queueName}`);
  } finally {
    await sender.close();
    await sbClient.close();
  }
}

async function receiveMessage() {
    // create a Service Bus client using the connection string to the Service Bus namespace
    const sbClient = new ServiceBusClient(connectionString);
  
    // createReceiver() takes the name of the queue as a parameter
    const receiver = sbClient.createReceiver(queueName);
  
    try {
      // Tries to receive a message from the Service Bus queue
      const messages = await receiver.receiveMessages(1);
  
      if (messages.length) {
        console.log(`Received message: ${messages[0].body}`);
        await receiver.completeMessage(messages[0]);
      } else {
        console.log("No messages received.");
      }
    } catch (err) {
      console.log(`Error when receiving message from the queue: ${queueName}`, err);
    } finally {
      await receiver.close();
      await sbClient.close();
    }
}
// receiveMessage()

module.exports = {
    sendMessageServiceBus
}