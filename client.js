const feathers = require('@feathersjs/feathers');
const rest = require('@feathersjs/rest-client');
const auth = require('@feathersjs/authentication-client');

const superagent = require('superagent');
const localStorage = require('localstorage-memory');

const feathersClient = feathers();

feathersClient.configure(rest('http://localhost:3030').superagent(superagent))
  .configure(auth({ storage: localStorage }));

feathersClient.authenticate({
  strategy: 'local',
  email: 'admin@feathersjs.com',
  password: 'admin'
})
.then(response => {
    console.log("--------------------------------")
  console.log('Authenticated!', response);
  return feathersClient.passport.verifyJWT(response.accessToken);
})
.then(payload => {
  console.log('JWT Payload', payload);
  return feathersClient.service('users').get(payload.userId);
})
.then(user => {
  feathersClient.set('user', user);
  console.log('User', feathersClient.get('user'));
})
.catch(function(error){
  console.error('Error authenticating!', error);
});