const AWS = require('aws-sdk');
const _ = require('lodash');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = (number) => {
  // console.log(number, type);
  // console.log('event: ',event);
  return new Promise((resolve, reject) => {
    const params = {
      TableName: 'ATnumberType',
      Key: {
        number: Number(number)
      },
    };
    
    dynamoDB.get(params, (error, result) => {
      // handle potential errors
      if (error) {
        console.log(`GET_ERROR: ${error.code}`);
        console.log(`GET_ERROR_MESSAGE: ${error.message}`);
        reject(error);
      } else {
        // found number type
        if (_.has(result, 'Item.type')) {
          console.log('GOT_NUMBER_TYPE');
          console.log(`NUMBER: ${params.Key.number}`);
          console.log(`TYPE: ${result.Item.type}`);
          resolve(result.Item.type);
        }
        // no number type recorded yet
        else {
          console.log('NUMBER_TYPE_UNDEFINED');
          resolve(result.Item);
        }
      }
    });
  });
};