const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

const LookupsClient = require('twilio').LookupsClient;
const client = new LookupsClient(accountSid, authToken);

module.exports.checkTwilio = (event, context, callback) => {
  // console.log(event);
  checkNumberTwilio(event, callback);
};

function checkNumberTwilio (event, callback) {
  // convert shitty stuff to json
  // const eventData = JSON.parse(event.body);
  // console.log(eventData);
  client.phoneNumbers('+14155704058').get({
    type: 'carrier'
  }, (error, data) => {
    //error
    if (error) {
      console.log(`ERROR: ${error.status}`);
      console.log(`ERROR MSG: ${error.message}`);
      const errResponse = {
        statusCode: error.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: error.message,
          error: error
        }),
      };
      return callback(null, errResponse);
    }
  
    console.log('NUMBER_DETAILS_LOOKED_UP');
    console.log(data);
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        data: data
      }),
    };
  
    callback(null, response);
  });
  
  
  // use twilio SDK to send text message
  twilioClient.messages.create(sms, (error, data) => {
    
    // text sent
    console.log('NEW_MESSAGE_SENT');
    console.log(`DATE_SENT: ${data.dateCreated}`);
    console.log(`TO: ${data.to}`);
    console.log(`FROM: ${data.from}`);
    console.log(`MESSAGE: ${data.body}`);
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Text sent'
      }),
    };
    
    callback(null, response);
  });
}