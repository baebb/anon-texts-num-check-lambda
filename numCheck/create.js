'use strict';

const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.create = (number, type) => {
  // console.log('event: ',event);
  const params = {
    TableName: 'isMobile',
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
    } else {
      console.log('NEW_NUMBER_ADDED');
      console.log(`NUMBER: ${params.Item.number}`);
      console.log(`TYPE: ${params.Item.type}`);
    }
  });
};