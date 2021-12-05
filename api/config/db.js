'use strict'

const knexfile = require('../knexfile')
const knex = require('knex')(knexfile.production)

//const {attachOnDuplicateUpdate} = require('knex-on-duplicate-update');
//attachOnDuplicateUpdate();

module.exports = { knex }

