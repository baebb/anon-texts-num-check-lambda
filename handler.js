const checkNumberDb = require('./js/checkNumberDb');
const createNumberDb = require('./js/createNumberDb');
const checkNumberTwilio = require('./js/checkNumberTwilio');

module.exports.checkNumber = (event, context, callback) => {
  // console.log(event);
  // convert stuff to json if needed
  let eventData;
  try {
    eventData = JSON.parse(event.body);
  } catch (e) {
    eventData = event.body;
  }
  checkNumber(eventData, callback);
};

function checkNumber(eventData, callback) {
  const numberToCheck = eventData.number;
  console.log(`NEW_NUMBER_CHECK ${numberToCheck}`);
  let response = {
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  };
  // Check if the number provided is actually a number . . .
  if (isNaN(numberToCheck) || numberToCheck.length !== 10) {
    console.log(`NOT_A_NUMBER ${numberToCheck}`);
    response.statusCode = 200;
    response.body = JSON.stringify({ number: numberToCheck, type: 'not_a_number' });
    callback(null, response);
  }
  else if (numberToCheck.substr(0, 2) === '04') {
    console.log(`PROBS_AUSTRALIAN_MOBILE ${numberToCheck}`);
    const auFormattedNumber = `+61${numberToCheck}`;
    // Check DB if number already exists
    checkNumberDb(auFormattedNumber)
      .then((res) => {
        if (res === undefined) {
          console.log(`RECORDING_NUMBER ${numberToCheck}`);
          createNumberDb(numberToCheck, 'mobile', 'AU')
            .then(() => {
              // console.log('recoding datas and ending request');
              response.statusCode = 200;
              response.body = JSON.stringify({
                number: numberToCheck,
                type: 'mobile',
                countryCode: 'AU'
              });
              callback(null, response);
            })
            .catch((err) => {
              // console.log('DB fucked up because:', err);
              console.log(`RECORDING_NUMBER_ERROR ${numberToCheck} ${err}`);
              response.statusCode = 500;
              response.body = JSON.stringify(err);
              callback(null, response);
            })
        }
        // DB has record
        else {
          console.log(`NUMBER_RECORD_LOOKED_UP ${numberToCheck} ${res}`);
          response.statusCode = 200;
          response.body = JSON.stringify({
            number: numberToCheck,
            type: res.type,
            countryCode: res.country
          });
          callback(null, response);
        }
      })
      .catch((err) => {
        console.log(`RECORD_LOOKUP_ERROR ${numberToCheck} ${err}`);
        response.statusCode = 500;
        response.body = JSON.stringify(err);
        callback(null, response);
      })
  }
  else {
    const usFormattedNumber = `+1${numberToCheck}`;
    // Check DB if number already exists
    checkNumberDb(usFormattedNumber)
      .then((res) => {
        // DB got no record so we gotta check with Twilio
        if (res === undefined) {
          console.log(`TWILIO_LOOKING_UP_NUMBER ${numberToCheck}`);
          checkNumberTwilio(usFormattedNumber)
            .then((res) => {
              // console.log('twilio checked and found it was a', res);
              // Got number type and recording it
              console.log(`TWILIO_NUMBER_LOOKED_UP ${numberToCheck} ${res}`);
              createNumberDb(numberToCheck, res, 'US')
                .then(() => {
                  // console.log('recoding datas and ending request');
                  console.log(`RECORDING_NUMBER ${numberToCheck}`);
                  response.statusCode = 200;
                  response.body = JSON.stringify({
                    number: numberToCheck,
                    type: res,
                    countryCode: 'US'
                  });
                  callback(null, response);
                })
                .catch((err) => {
                  // console.log('DB fucked up because:', err);
                  console.log(`RECORDING_NUMBER_ERROR ${numberToCheck} ${err}`);
                  response.statusCode = 500;
                  response.body = JSON.stringify(err);
                  callback(null, response);
                })
            })
            .catch((err) => {
              // console.log('twilio erred because:', err);
              console.log(`TWILIO_LOOKUP_ERROR ${numberToCheck} ${err}`);
              response.statusCode = 500;
              response.body = JSON.stringify(err);
              callback(null, response);
            })
        }
        // DB has record
        else {
          console.log(`NUMBER_RECORD_LOOKED_UP ${numberToCheck}`);
          response.statusCode = 200;
          response.body = JSON.stringify({
            number: numberToCheck,
            type: res.type,
            countryCode: res.country
          });
          callback(null, response);
        }
      })
      .catch((err) => {
        console.log(`RECORD_LOOKUP_ERROR ${numberToCheck} ${err}`);
        response.statusCode = 500;
        response.body = JSON.stringify(err);
        callback(null, response);
      })
  }
}