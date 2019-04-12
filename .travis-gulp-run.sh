#!/bin/bash
# encoding: utf-8

if [ "${TRAVIS_BRANCH}" != "release" ] 
then 
	npm install -g gulp
	gulp clean && gulp build && gulp build:min;
fi

