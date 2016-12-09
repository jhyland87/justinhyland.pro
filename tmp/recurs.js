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


function newPath( yamlFile ){
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

  /*
  console.log('yamlName:', yamlName)
  console.log('yamlDir:', yamlDir)
  console.log('jsonFile:', jsonFile)
  console.log('relativeFromSrc:', relativeFromSrc)
  console.log('relativeDestFile:', relativeDestFile)
  */

  return relativeDestFile


/*
yamlName: skillsets.yaml
yamlDir: source/data/professional
jsonFile: skillsets.json
relativeFromSrc: professional
relativeDestFile: source/json/professional/skillsets.json


  // EG yamlFile: source/data/professional/skillsets.yaml

  let yamlName = path.basename( yamlFile )
  // skillsets.yaml
  let yamlDir = path.dirname( yamlFile )
  // source/data/professional

  let doDiff = ( d, i ) => config.src.split('/')[ i ] === d


  // Get the path of the yaml file, relative 
  let dirDiff = _.dropWhile( yamlDir.split('/'), doDiff )

  //console.log('dirDiff:',dirDiff)


  return path.resolve( config.dest, dirDiff.join('/'), yamlName )*/
}





function processYamlFiles( yamlFiles ){
  let src  = path.normalize( config.src )
  let dest = path.normalize( config.dest )


  // assuming openFiles is an array of file names
  async.each( yamlFiles, ( yamlFile, callback ) => {
    // yamlFile: source/data/configs/meta.yaml

    let yamlDir = path.dirname( yamlFile )
    // yamlDir: source/data/configs

    let yamlName = path.basename( yamlFile )
    // yamlName: meta.yaml

    let jsonName = _.replace( yamlName, '.yaml', '.json' )
    // jsonName: meta.json

    let jsonRelDir = newPath( yamlFile )


    console.log('>>> yamlFile: %s', yamlFile)
    console.log('\t yamlDir: %s', yamlDir)
    console.log('\t yamlName: %s', yamlName)
    console.log('\t jsonName: %s', jsonName)
    console.log('\t jsonRelDir: %s', jsonRelDir)

    try {
      let yamlData = fs.readFileSync( yamlFile, 'utf8' )
      let jsonData = yaml.safeLoad( yamlData )

      //console.log( JSON.stringify( jsonData ) )

      fs.writeFile( jsonRelDir, JSON.stringify( jsonData ), err => {
        if ( err ) {
            return callback( err )
        }

        //console.log( "The file %s was saved!", jsonFile )
        console.log( '%s -> %s', yamlFile, jsonRelDir )
        callback()
      })
    } 
    catch ( e ) {
      console.log( 'Error:', e )
    }
  }, err => {
    // if any of the file processing produced an error, err would equal that error
    if ( err ) {
      // One of the iterations produced an error.
      // All processing will now stop.
      console.log( 'A file failed to process' )
    } 
    else {
      console.log( 'All files have been processed successfully' )
    }
  })
}

//recursive( config.src, processYamlFiles )

recursive( config.src, ( err, files ) => {
  const yamlFiles = _.filter( files, f => _.endsWith( f, '.yaml' ) )

  //console.log('Found Files (%s):', files.length, files)
  //console.log('Filtered Files (%s):', yamlFiles.length, yamlFiles)

  if ( files.length !== yamlFiles.length ){
    console.log( 'Filtered file list, removing %s non-yaml files', (files.length - yamlFiles.length) )
  }

  processYamlFiles( yamlFiles )
})

/*
// ignore files named 'foo.cs' or files that end in '.html'. 
recursive( 'source/data/', ( err, files ) => {
  // Files is an array of filename 
  console.log( 'Found Files:', files )

  _.forEach( files, yamlFile => {
    let stats = fs.stat( yamlFile, ( err, yamlStats ) => {
      if ( err ){
        console.log( 'Stats failed for %s:', yamlFile, err )
        return
      }

      console.log( 'Stats for %s:', yamlFile, yamlStats )
    })

    let jsonFile = _.replace( yamlFile, 'yaml', 'json' )

    //console.log('Processing:', yamlFile)

    try {
      let yamlData = fs.readFileSync( yamlFile, 'utf8' )
      let jsonData = yaml.safeLoad( yamlData )

      //console.log( JSON.stringify( jsonData ) )

      fs.writeFile( jsonFile, JSON.stringify( jsonData ), err => {
        if ( err ) {
            return console.log( err )
        }

        //console.log( "The file %s was saved!", jsonFile )
        console.log( '%s -> %s', yamlFile, jsonFile )
      })
    } catch ( e ) {
      console.log( 'Error:', e )
    }
  })
})*/