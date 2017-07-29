const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(twilioAccountSid, twilioAuthToken);

module.exports = (number) => {
  return new Promise((resolve, reject) => {
    client.lookups.v1.phoneNumbers(number)
      .fetch({ type: 'carrier' })
      .then((data) => {
        console.log('NEW_NUMBER_DETAILS_LOOKED_UP');
        console.log(`NUMBER=${number}`);
        console.log(`NUMBER_TYPE=${data.carrier.type}`);
        resolve(data.carrier.type);
      })
      .catch((error) => {
        //error
        console.log(`ERROR: ${error.status}`);
        console.log(`ERROR_MSG: ${error.message}`);
        reject(error);
      });
  });
};