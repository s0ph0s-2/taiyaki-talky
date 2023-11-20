#!/bin/sh

REDBEAN=redbean.com
if [ ! -f "$REDBEAN" ]; then
	wget https://redbean.dev/redbean-original-2.2.com
	mv redbean-original-2.2.com "$REDBEAN"
	chmod +x "$REDBEAN"
fi

if [ -d dist ]; then
	cp args dist/.args
	cd dist
	REDBEAN="../redbean.com"
else
	cp args .args
	cp public/icon-512.png icon-512.png
	cp public/tt.json tt.json
fi
zip -r "$REDBEAN" index.html index.css .args icon-512.png index.js tt.json sw.js
