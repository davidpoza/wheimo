#!/bin/ash

if [ "$DEBUG" = true ] ;
then
  npm run start-dev
else
  npm run start
fi
