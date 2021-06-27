#!/bin/bash

mkdir -p ./dist
cp -r resources/* dist
cp manifest.json dist
cp node_modules/webextension-polyfill/dist/browser-polyfill.min.js dist
npm run build

rm ogs-helper.xpi
cd ./dist
zip ogs-helper.xpi -r . --exclude "*/.git/*"
mv ogs-helper.xpi ..
