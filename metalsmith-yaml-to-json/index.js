const recursive = require( 'recursive-readdir' )
const yaml      = require( 'js-yaml' )
const fs        = require( 'fs' )
const _         = require( 'lodash' )
const async     = require( 'async' )
const path      = require( 'path' )
const debug     = require( 'debug' )('metalsmith-yaml-to-json')
const mkdirp    = require( 'mkdirp' )
const Promise   = require( 'bluebird' )
/*
mkdirp('/tmp/foo/bar/baz', function (err) {
    if (err) console.error(err)
    else console.log('pow!')
})
*/


module.exports = plugin

/**
 */
function plugin ( options ) {
  const config = {
    yamlExt: [ 'yaml', 'yml' ],
    yamlRegex: null,
    jsonExt: 'json',
    clean: true
  }

  debug('Options: %s', JSON.stringify( options ) )

  if ( typeof options.src !== 'string' && typeof options.source !== 'string' ){
    debug('No "src" or "source" value specified in options' )

    throw new Error( 'No source specified' )
  }

  if ( typeof options.dst !== 'string' && typeof options.dest !== 'string' ){
    debug('No "dst" or "dest" value specified in options' )
    
    throw new Error( 'No destination specified' )
  }

  config.src = options.src || options.source
  config.dest = options.dst || options.dest

  config.src = path.resolve( config.src )
  config.dest = path.resolve( config.dest )

  if ( typeof options.yamlExt === 'string' ){
    config.yamlExt = [ options.yamlExt ]
    debug( 'One yaml extension was provided: %s', options.yamlExt )
  }
  else if ( Array.isArray( options.yamlExt ) ){
    config.yamlExt = options.yamlExt
    debug( 'An array of yaml extensions was provided: %s', JSON.stringify( options.yamlExt ) )
  }

  if ( typeof options.yamlRegex !== 'undefined' ){
    if ( _.isRegExp( options.yamlRegex ) ){
      config.yamlRegex = options.yamlRegex

      debug( 'A custom yaml filter regex pattern was provided (in RegExp format): %s', options.yamlRegex.toString() )
    }
    else if ( typeof options.yamlRegex === 'string' ){
      try {
        config.yamlRegex = new RegExp( options.yamlRegex )

        debug( 'A custom yaml filter regex pattern was provided (in string format): %s', fg.yamlRegex.toString() )
      }
      catch( e ){
        debug( 'Failed to convert the yaml regex string into a RegExp object: %s', e.toString() )
      }
    }
    else {
      debug( 'An invalid value was provided for the yamlRegex option, expecting a string or RegExp object - received typeof: %s', typeof options.yamlRegex )
    }
  }


  debug( 'Source: %s', config.src )
  debug( 'Destination: %s', config.dest )

  return function( files, metalsmith, done ){
    setImmediate( done )

    //debug('File Count: %s', Object.keys(options).length )

    debug('Yaml source directory:', path.resolve( config.src ))
     
    /**
     * 1) Recursively iterate through the source directory
     */
    recursive( config.src, ( err, fileList ) => {

      if ( err ){
        debug( 'An error was encountered when trying to recursively iterate through %s; Error: %s', config.src, err )
        return done()
      }

      if ( ! fileList ){
        debug( 'No files were found in %s', config.src )
        return done()
      }

      console.log('fileList:',fileList)
      


      const yamlRegExp = new RegExp( '.' + config.yamlExt.join('|') + '$' )
      //debug( '' )

      //f.match( new RegExp( '.' + exts.join('|') + '$') )

      /**
       * 2) Filter out any non-yaml files
       */
      const yamlFiles = _.filter( fileList, f => {

        if ( config.yamlRegex && f.match( config.yamlRegex ) ){
          debug( 'The file "%s" matches the provided yaml RegExp pattern %s - Including file', f, config.yamlRegex.toString() )
          return true
        }

        if ( f.match( yamlRegExp ) ){
          debug( 'The file "%s" matches the yaml RegExp pattern %s - adding to list', f, yamlRegExp.toString() )
          return true
        }

        debug( 'The file "%s" does not match any pattern - ignoring', f )

        return false
      })

      if ( ! yamlFiles ){
        debug( 'No yaml files were found' )
        done()
      }

      if ( fileList.length !== yamlFiles.length ){
        debug( 'Filtered file list from %s to %s by removing %s non-yaml files', fileList.length, yamlFiles.length, (fileList.length - yamlFiles.length) )
      }


      /**
       * Function that determines the file name and destination of a given yaml file
       *
       * @param   {string}  yamlFile  Yaml file name (with path, either relative or absolute)
       * @returns {string}            File name and destination of converted JSON file
       * @example // Assume config.dest = '_build/json'
       *  newPath( 'source/data/professional/skillsets.yaml')
       *    // '_build/json/professional/skillsets.json'
       */
      const newPath = yamlFile => {
        // yamlFile: source/data/professional/skillsets.yaml

        let yamlName = path.basename( yamlFile )
        // yamlName: skillsets.yaml

        let yamlDir = path.dirname( yamlFile )
        // yamlDir: source/data/professional

        let jsonFile = _.replace( yamlName, 'yaml', 'json' )
        // jsonFile: skillsets.json

        let relativeFromSrc = path.relative( config.src, yamlDir )
        // relativeFromSrc: professional

        let relativeDestFile = path.join( config.dest, relativeFromSrc, jsonFile )
        // relativeDestFile: source/json/professional/skillsets.json

        /*
        console.log('yamlName:', yamlName)
        console.log('yamlDir:', yamlDir)
        console.log('jsonFile:', jsonFile)
        console.log('relativeFromSrc:', relativeFromSrc)
        console.log('relativeDestFile:', relativeDestFile)
        */

        debug( '[newPath] Converted yaml file %s to %s', yamlFile, relativeDestFile )
        return relativeDestFile
      }

      //processYamlFiles( yamlFiles )

      async.each( yamlFiles, ( yamlFile, callback ) => {
        // yamlFile: source/data/configs/meta.yaml

        let yamlDir = path.dirname( yamlFile )
        // yamlDir: source/data/configs

        let yamlName = path.basename( yamlFile )
        // yamlName: meta.yaml

        let jsonName = _.replace( yamlName, '.yaml', '.json' )
        // jsonName: meta.json

        let jsonRelDir = newPath( yamlFile )


        debug( 'Processing Yaml File: %s', yamlFile )
        debug( '\t YAML Location: %s', yamlFile )
        debug( '\t YAML Directory: %s', yamlDir )
        debug( '\t YAML File Name: %s', yamlName )
        debug( '\t JSON Location: %s', jsonRelDir )
        debug( '\t JSON Directory: %s', path.dirname( jsonRelDir ) )
        debug( '\t jsonRelDir: %s', jsonRelDir )
        debug( '\t JSON File Name: %s', jsonName )

        try {
          let yamlData = fs.readFileSync( yamlFile, 'utf8' )
          let jsonData = yaml.safeLoad( yamlData )

          //console.log( JSON.stringify( jsonData ) )

          fs.writeFile( jsonRelDir, JSON.stringify( jsonData, null, 2 ), err => {
            if ( err ) {
                return callback( err )
            }

            //console.log( "The file %s was saved!", jsonFile )
            debug( '%s -> %s', yamlFile, jsonRelDir )
            callback()
          })
        } 
        catch ( e ) {
          debug( 'An exception was encountered while processing the file "%s" - Error: %s', yamlFile, e.toString() )
          callback()
        }
      }, err => {
        // if any of the file processing produced an error, err would equal that error
        if ( err ) {
          // One of the iterations produced an error.
          // All processing will now stop.
          debug( 'An exception was encountered while iterating over the yaml file list - Error: %s', err.toString() )
          return done()
        } 
        else {
          console.log( 'All files have been processed successfully' )
          debug( 'All files have been processed successfully' )
          return done()
        }
      })
    })
  }
}
