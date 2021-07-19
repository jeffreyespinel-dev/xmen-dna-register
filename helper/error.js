const getErrorResponse = (info, statusCode = 500, type = 'ERROR') => {
  return {
    statusCode: (info ? info.statusCode : statusCode) || statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(info),
    type
  };
};

module.exports = { getErrorResponse };