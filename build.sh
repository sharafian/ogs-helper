#!/bin/bash

rm ogs-helper.xpi
zip ogs-helper.xpi -r . --exclude "*/.git/*"
