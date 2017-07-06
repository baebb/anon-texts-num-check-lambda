const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(twilioAccountSid, twilioAuthToken);

module.exports.checkTwilio = (event, context, callback) => {
  // console.log(event);
  checkNumberTwilio(event, callback);
};

function checkNumberTwilio(event, callback) {
  // convert stuff to json if needed
  let eventData;
  try {
    eventData = JSON.parse(event.body);
  } catch (e) {
    eventData = event.body;
  }
  
  client.lookups.v1.phoneNumbers(eventData.number)
    .fetch({ type: 'carrier' })
    .then((data) => {
      console.log('NEW_NUMBER_DETAILS_LOOKED_UP');
      console.log(`NUMBER=${eventData.number}`);
      console.log(`NUMBER_TYPE=${data.carrier.type}`);
      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          data: data.carrier
        }),
      };
      return callback(null, response);
    })
    .catch((error) => {
      //error
      console.log(`ERROR: ${error.status}`);
      console.log(`ERROR_MSG: ${error.message}`);
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
    });
}