#!/usr/bin/env bash

NODE_MODULES=node_modules

if [ ! -d $NODE_MODULES/app ]; then
    ln -s . $NODE_MODULES/app
fi