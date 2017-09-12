const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = (number, type, countryCode) => {
  // console.log(number, type);
  // console.log('event: ',event);
  const countryPrefix = {
    US: 1,
    AU: 61
  };
  return new Promise((resolve, reject) => {
    const params = {
      TableName: 'ATnumberType',
      Item: {
        number: Number(countryPrefix[countryCode] + number),
        type: type,
        country: countryCode
      },
    };
    
    dynamoDB.put(params, (error) => {
      // handle potential errors
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  });
};