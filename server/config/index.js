'use strict';

const path = require('path');

const development = require('./env/development');

const defaults = {
    root: path.join(__dirname, '../..')
};

module.exports = {
    development: Object.assign({}, development, defaults)
}[process.env.NODE_ENV || 'development'];
