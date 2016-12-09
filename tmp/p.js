

const recursive = require( 'recursive-readdir' )
const yaml      = require( 'js-yaml' )
const fs        = require( 'fs' )
const _         = require( 'lodash' )
const async     = require( 'async' )
const path      = require( 'path' )
const Promise   = require( 'bluebird' )

const config = {
  src: 'source/data/',
  dest: 'source/json/'
}

var yamlFile = 'source/data/professional/skillsets.yaml'

let yamlName = path.basename( yamlFile )
// skillsets.yaml

let yamlDir = path.dirname( yamlFile )
// source/data/professional

let jsonFile = _.replace( yamlName, 'yaml', 'json' )
// skillsets.json

let relativeFromSrc = path.relative( config.src, yamlDir )
// professional

let relativeDestFile = path.join( config.dest, relativeFromSrc, jsonFile )
// source/json/professional/skillsets.json

console.log('yamlName:', yamlName)
console.log('yamlDir:', yamlDir)
console.log('jsonFile:', jsonFile)
console.log('relativeFromSrc:', relativeFromSrc)
console.log('relativeDestFile:', relativeDestFile)


/*
yamlName: skillsets.yaml
yamlDir: source/data/professional
jsonFile: skillsets.json
relativeFromSrc: professional
relativeDestFile: source/json/professional/skillsets.json
*/