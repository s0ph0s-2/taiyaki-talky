#!/bin/sh

if [ -d dist ]; then
	cp args dist/.args
	cd dist
	REDBEAN="../redbean.com"
else
	cp args .args
	REDBEAN="redbean.com"
fi
zip -r ../redbean.com index.html .args assets/*
