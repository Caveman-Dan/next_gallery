#!/bin/bash

export NVM_DIR=$HOME/.nvm;
source $NVM_DIR/nvm.sh;

cd /home/dan/node/next_gallery

nvm use 22 && npm run start
