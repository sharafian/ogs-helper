#!/bin/bash

mkdir -p ./dist
cp -r resources/* dist
cp manifest.json dist
npm run build

rm ogs-helper.xpi
cd ./dist
zip ogs-helper.xpi -r . --exclude "*/.git/*"
mv ogs-helper.xpi ..
