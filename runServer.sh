#!/bin/bash

export NVM_DIR=$HOME/.nvm;
source $NVM_DIR/nvm.sh;

cd /home/dan/node/next_gallery

nvm use 18 && npm run start
