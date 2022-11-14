const ERROR_MESSAGE = {
  ERR5001001: { message: { title: 'Server Error', description: 'A server error has occurred which failed to fulfill the request. Please try again or contact the administrator.' } },
  
  ERR4001001: { message: { title: 'Invalid Credentials', description: 'The email or password is incorrect.' } },
  ERR4001002: { message: { title: 'Validation Error', description: 'Some details might be invalid or incomplete. Kindly verify your inputs.' } },
  ERR4001003: { message: { title: 'Forbidden - Access Denied', description: 'You are not allowed to access this resource.' } },
  ERR4001004: { message: { title: 'Token Expired', description: 'The access token provided has expired. Please log in again.' } },
  ERR4001005: { message: { title: 'No Access Token', description: 'The access token is either missing or invalid.' } },
  ERR4001006: { message: { title: 'Account Details Taken', description: 'An account with the same upLive ID, upLive name, or email already exists.' } },

  ERR4001007: { message: { title: 'Not Found', description: 'The requested information does not exist.' } },

  ERR4001008: { message: { title: 'Invalid Password', description: 'The old password is incorrect.' } },

};

module.exports = { ERROR_MESSAGE };