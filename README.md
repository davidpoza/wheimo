# WHEIMO
Acronym for Where is my money, a web app for expenses tracking.
This is a monorepo. For frontend I'm using React, and on backend, Node express.js with an sqlite database.

## Installation
```
touch database.sqlite
docker-compose up
```

## Prerequisites
- Node.js >= 13, I'm using 14.15.4
- python to build sqlite3 package using node-pre-gyp (sudo apt install python)

## Environment variables

```
PORT=4321

LOG_LEVEL=

# secret for encryption of jwt signature
JWT_SECRET=yoursecret

# number of rounds for Blowfish algorithm for hashing user password
BCRYPT_ROUNDS=12

# lifetime of the token (in seconds)
JWT_LIFETIME=86400

# algorithm used in token signing
JWT_ALGORITHM=HS256

# passphrase used to encrypt access password
AES_PASSPHRASE=xxxxxxx

# Resync frequency in minutes
RESYNC_FREQ=10

# Vapid keys for web push notifications
# generate using npx web-push generate-vapid-keys
PRIVATE_VAPID_KEY=xxxxxxxxx
REACT_APP_PUBLIC_VAPID_KEY=yyyyyyyyyy
```

## API
### /auth
#### POST: /auth/signup
Creates user account
Fields:
- email <string> (required)
- password <string> (required)
- name <string>
#### POST: /auth/signin
Generates jwt valid token
Fields:
- email <string> (required)
- password <string> (required)
-----
### /users
#### GET: /users
Retrieves users

#### POST: /users
Creates user
Fields:
- email <string> (required)
- password <string> (required)
- level <string>
#### PATCH: /users
Updates user

#### DELETE: /users
Deletes user

-----
### /accounts

#### GET: /accounts
Retrieves banks accounts

#### POST: /accounts
Creates bank account
Fields:
- name <string> (required)
- number <string> (required)
- description <string>
- accessId <string>
- accessPassword <string>
#### PATCH: /accounts
Updates bank account
Fields:
- name <string> (required)
- number <string> (required)
- description <string>
- accessId <string>
- accessPassword <string>

#### DELETE: /accounts
Deletes bank account

-----
### /transactions

#### GET: /transactions
Retrieves transactions

#### POST: /transactions
Creates transaction
Fields:
- amount <number> (required)
- emitter <string> (required)
- emitterName <string>
- description <string>
- tags <Array(numbers)>

#### PATCH: /transactions
Updates transaction
#### DELETE: /transactions
Deletes transaction

-----
### /tags

#### GET: /tags
Retrieves tags

#### POST: /tags
Creates tag
Fields:
- name <string>
- rules <Array(number)>: Arrays of rule ids

#### PATCH: /tags
Updates tag

#### DELETE: /tags
Deletes tags

-----
### /rules

#### GET: /rules
Retrieves tagging rules

#### POST: /rules
Creates tagging rule
Fields:
- name <string>
- type <string>
- value <string>

#### PATCH: /rules
Updates tagging rule

#### DELETE: /rules
Deletes tagging rule

-----
### /recurrents

#### GET: /recurrents
Retrieves recurrent payments

#### POST: /recurrents
Creates recurrent payment
Fields:
- name <string> (required)
- emitter <string> (required)
- amount <number> (required)
- transactionId <identificator>
#### PATCH: /recurrents
Updates recurrent payment
#### DELETE: /recurrents
Deletes recurrent payment