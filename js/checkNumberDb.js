const AWS = require('aws-sdk');
const _ = require('lodash');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = (number) => {
  // console.log(number, type);
  // console.log('event: ',event);
  return new Promise((resolve, reject) => {
    const params = {
      TableName: 'isMobile',
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
        console.log('GOT_NUMBER_DETAILS');
        console.log(`NUMBER: ${params.Key.number}`);
        //no number type recorded yet
        if (_.has(result, 'Item.type')) {
          console.log(`TYPE: ${result.Item.type}`);
          resolve(result.Item.type);
        } else {
          console.log('NUMBER_TYPE_UNDEFINED');
          resolve(result.Item);
        }
      }
    });
  });
};