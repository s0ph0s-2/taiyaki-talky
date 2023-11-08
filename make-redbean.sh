#!/bin/sh

if [ -d dist ]; then
	cp init.lua dist/.init.lua
	cd dist
	REDBEAN="../redbean.com"
else
	cp init.lua .init.lua
	REDBEAN="redbean.com"
fi
zip -r ../redbean.com index.html .init.lua assets/*
