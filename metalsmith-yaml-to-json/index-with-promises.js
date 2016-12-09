const recursive = require( 'recursive-readdir' )
const yaml      = require( 'js-yaml' )
const fs        = require( 'fs' )
const _         = require( 'lodash' )
const async     = require( 'async' )
const path      = require( 'path' )
const debug     = require( 'debug' )('metalsmith-yaml-to-json')
const mkdirp    = require( 'mkdirp' )
const Promise   = require( 'bluebird' )

mkdirp('/tmp/foo/bar/baz', function (err) {
    if (err) console.error(err)
    else console.log('pow!')
})


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


    })
  }
}
/*
function mainPlugin( files, metalsmith, callback ){
  setImmediate( callback )

  return new Promise( ( res, rej ) => {
    debug('Yaml source directory:', path.resolve( config.src ))
    return res( 'Set to... ???' )
  }).asCallback( callback )
  }

function filterFiles( err, fileList ){
  return new Promise( ( res, rej ) => {
    return res( 'Set to... ???' )
  }).asCallback( callback )
}

function processYamlFiles( yamlFile, callback ){
  return new Promise( ( res, rej ) => {
    return res( 'Set to... ???' )
  }).asCallback( callback )
}
*/
