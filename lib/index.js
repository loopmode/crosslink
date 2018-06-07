#!/usr/bin/env node
"use strict";

require('@babel/register');

require('@babel/polyfill');

module.exports = require('./cli');