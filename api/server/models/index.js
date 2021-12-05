'use strict'

const fs = require('fs')
const path = require('path')
const { knex, knex_img } = require('../../config/db')

const getModelFiles = dir => fs.readdirSync(dir)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .map(file => path.join(dir, file))

const files = getModelFiles(__dirname)

const models = files.reduce((modelsObj, filename) => {
  const initModel = require(filename)
  const model = initModel(knex)

  if(model.name != "Img") {
    if (model) modelsObj[model.name] = model
  } else {
    const model_2 = initModel(knex_img)
    if (model_2) modelsObj[model_2.name] = model_2
    return modelsObj
  } 

  return modelsObj
}, {})

module.exports =  models