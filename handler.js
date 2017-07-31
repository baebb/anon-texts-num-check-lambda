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
  console.log(`NEW_NUMBER_CHECK ${eventData.number}`);
  let response = {
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  };
  // Check if the number provided is actually a number . . .
  if (isNaN(eventData.number)) {
    console.log(`NOT_A_NUMBER ${eventData.number}`);
    response.statusCode = 200;
    response.body = JSON.stringify({ number: eventData.number, type: 'not_a_number' });
    callback(null, response);
  }
  // Check DB if number already exists
  else {
    checkNumberDb(eventData.number)
      .then((res) => {
        // DB got no record so we gotta check with Twilio
        if (res === undefined) {
          console.log(`LOOKING_UP_NUMBER ${eventData.number}`);
          checkNumberTwilio(eventData.number)
            .then((res) => {
              // console.log('twilio checked and found it was a', res);
              // Got number type and recording it
              console.log(`RECORDING_NUMBER ${eventData.number} ${res}`);
              createNumberDb(eventData.number, res)
                .then(() => {
                  // console.log('recoding datas and ending request');
                  response.statusCode = 200;
                  response.body = JSON.stringify({ number: eventData.number, type: res });
                  callback(null, response);
                })
                .catch((err) => {
                  // console.log('DB fucked up because:', err);
                  response.statusCode = 500;
                  response.body = JSON.stringify(err);
                  callback(null, response);
                })
            })
            .catch((err) => {
              // console.log('twilio erred because:', err);
              response.statusCode = 500;
              response.body = JSON.stringify(err);
              callback(null, response);
            })
        }
        // DB has record, says it's good
        else if (res === 'mobile') {
          // console.log('is mobile, done');
          response.statusCode = 200;
          response.body = JSON.stringify({ number: eventData.number, type: res });
          callback(null, response);
        }
        // DB has record, says it's bad
        else {
          // console.log('not a mobile, fuck off');
          response.statusCode = 200;
          response.body = JSON.stringify({ number: eventData.number, type: res });
          callback(null, response);
        }
      })
      .catch((err) => {
        // console.log('erred on checkdb', err);
        response.statusCode = 500;
        response.body = JSON.stringify(err);
        callback(null, response);
      })
  }
}