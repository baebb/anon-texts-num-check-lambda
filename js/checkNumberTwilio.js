const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(twilioAccountSid, twilioAuthToken);

module.exports = (number) => {
  return new Promise((resolve, reject) => {
    client.lookups.v1.phoneNumbers(number)
      .fetch({ type: 'carrier' })
      .then((data) => {
        resolve(data.carrier.type);
      })
      .catch((error) => {
        // there is no such number
        if (error.status === 404) {
          resolve('not_a_number');
        } else {
          // actual error
          reject(error);
        }
      });
  });
};