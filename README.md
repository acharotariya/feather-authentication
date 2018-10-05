# feather-authentication

create server and client file diffrent.

client have feathers client and server start.

========================   create users  ===============================

curl 'http://localhost:3030/users/' -H 'Content-Type: application/json' --data-binary '{ "email": "test@example.com", "password": "secret" }'

========================  authenticate users ===========================

curl 'http://localhost:3030/authentication/' -H 'Content-Type: application/json' --data-binary '{ "strategy": "local", "email": "test@example.com", "password": "secret" }'

