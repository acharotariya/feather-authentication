const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const auth = require('@feathersjs/authentication');
const local = require('@feathersjs/authentication-local');
const jwt = require('@feathersjs/authentication-jwt');
const memory = require('feathers-memory');

const app = express(feathers());
app.configure(express.rest())
 .configure(socketio())
 .use(express.json())
 .use(express.urlencoded({ extended: true }))
 .configure(auth({ secret: '820101116e88ce01bdfaae317dfe165dfb62cf88111f4d7d0d754032f5fa38eb89bbe2f4f1c3d59356ab2640a7e8c6739ff6a06e53ac447fe174e017322584c7b88e3971e97e5abdaf6e86f6efe32ae8f4fa11e91679f12c272a484f8256b20abc7d57c00c041bbac9a11021221f73bbac56e31ced2a494a697288f4c2e98c8244a59da5a9a3190cabbf5bcac889b304413829c1b2f2aeee0300eac9fdd56515557540be3911b30606180fa9d1abb0681cc2e57821c9f6ef2520fe582ad64a1d829a60288449fbef3d0db1427e3bf808a4f5edf19bd31ef7c750e64c71edeaef8660953c7ab6071423c20e88af20923f1314dd35112e7691e87dfb46224c6b3e' }))
 .configure(local())
 .configure(jwt())
 .use('/users', memory())
  // .use('/', feathers.static(__dirname + '/public'))
 .use(express.errorHandler());

app.service('users').hooks({
  // Make sure `password` never gets sent to the client
  after: local.hooks.protect('password')
});

app.service('authentication').hooks({
 before: {
  create: [
   // You can chain multiple strategies
   auth.hooks.authenticate(['jwt', 'local'])
  ],
  remove: [
   auth.hooks.authenticate('jwt')
  ]
 }
});

// Add a hook to the user service that automatically replaces
// the password with a hash of the password before saving it.
app.service('users').hooks({
 before: {
  find: [
   auth.hooks.authenticate('jwt')
  ],
  create: [
   local.hooks.hashPassword({ passwordField: 'password' })
  ]
 }
});

const port = 3030;
let server = app.listen(port);
server.on('listening', function() {
 console.log(`Feathers application started on localhost:${port}`);
});