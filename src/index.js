#!/usr/bin/env node
if (process.env.NODE_ENV !== 'production') {
    require('@babel/register');
    require('@babel/polyfill');
}
module.exports = require('./cli');
