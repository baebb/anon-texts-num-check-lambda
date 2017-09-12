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
        reject(error);
      } else {
        // found number type
        if (_.has(result, 'Item.type')) {
          resolve(result.Item.type);
        }
        // no number type recorded yet
        else {
          resolve(result.Item);
        }
      }
    });
  });
};