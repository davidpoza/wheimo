# WHEIMO
Acronym for Where is my money, a web app for expenses tracking.
This is a monorepo. For frontend I'm using React, and on backend, Node express.js with an sqlite database.

# Prerequisites
- Node.js >= 13, I'm using 14.15.4

# Environment variables

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
```