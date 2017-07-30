const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = (number, type) => {
  // console.log(number, type);
  // console.log('event: ',event);
  return new Promise((resolve, reject) => {
    const params = {
      TableName: 'ATnumberType',
      Item: {
        number: Number(number),
        type: type
      },
    };
    
    dynamoDB.put(params, (error) => {
      // handle potential errors
      if (error) {
        console.log(`PUT_ERROR: ${error.code}`);
        console.log(`PUT_ERROR_MESSAGE: ${error.message}`);
        reject(error)
      } else {
        console.log('NEW_NUMBER_RECORDED');
        console.log(`NUMBER: ${params.Item.number}`);
        console.log(`TYPE: ${params.Item.type}`);
        resolve()
      }
    })
  });
};