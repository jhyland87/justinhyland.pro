const fs        = require( 'fs' )
const path      = require( 'path' )
const _         = require( 'lodash' )
const postcss   = require( 'postcss' )
const pdf       = require( 'html-pdf' )

// Metalsmith
const Metalsmith  = require( 'metalsmith' )
const permalinks  = require( 'metalsmith-permalinks' )
const metadata    = require( 'metalsmith-metadata' )
const collections = require( 'metalsmith-collections' )
const drafts      = require( 'metalsmith-drafts' )
const defaults    = require( 'metalsmith-default-values' )
//const markdown    = require( 'metalsmith-markdownit' )
const markdown    = require( '/Users/jhyland/Documents/Projects/metalsmith-markdownit' )
const layouts     = require( 'metalsmith-layouts' )
const minify      = require( 'metalsmith-html-minifier' )
const assets      = require( 'metalsmith-assets' )
const include     = require('metalsmith-include')
const webpack     = require( 'metalsmith-webpack')
const inplace     = require( 'metalsmith-in-place' )
//const webpack     = require( '/Users/jhyland/Documents/Projects/metalsmith-webpack2/' )
//const assertDir   = require( 'assert-dir-equal' )
const pug         = require( 'metalsmith-pug' )
//const jstransformer = require('metalsmith-jstransformer')
const debug       = require('debug')('new-resume')

//const buildPath   = '_build/'
const config = {
  source: 'source',
  buildPath: '_build'
}

var local_test_func = function( str ){ 
    return "You said: " + str
  }

const pug_options = {
  pretty: true,

  locals: {
  postName: 'good post name',
  testFunc: local_test_func
  },

  filters: {
  foo: block => block.replace('foo', 'bar')
  }
}


/* Metalsmith
 ******************************************************************************/

const siteBuild = Metalsmith(__dirname)
  .source( config.source )
  .destination( config.buildPath )
  .clean(true)
  .use(metadata({
    'site': 'site.yaml',
    'person': 'person.yaml',
    'details': 'data/details.yaml',
    'personal': 'data/personal.yaml',
    'meta_data': 'data/meta-info.yaml',
    'technical': 'data/technical.yaml'
  }))
  .use(include())
  .use(collections({
    education: {
      pattern: 'education/**/*.md',
      sortBy: 'startDate',
      reverse: true
    },
      experience: {
      pattern: 'experience/**/*.md',
      sortBy: 'startDate',
      reverse: true
    },
      pages: {
      pattern: '*.md'
    },
      foo: {
      pattern: 'foo.md',
      sortBy: 'startDate'
    }
  }))
  /*.use(inplace({
    engine: 'pug',
    pattern: '*.md'
  }))*/
  .use(defaults([{
    pattern: '*/**/*.md',
    defaults: {
      draft: true
    }
  }]))
  /*
  .use(webpack({
    context: path.resolve(__dirname, './templates/current/assets/js/'),
    //entry: './test.js',
    pattern: new RegExp('.+\.js$'),
    //pattern: '.+\\.js$',
    output: {
      path: path.resolve( __dirname, path.join( config.buildPath, '/assets/js/' ) ),
      filename: 'bundle.js'
    }
  }))
  */
  .use(webpack({
    context: path.resolve( __dirname, 'source/js/webpack-components' ),
    entry: ['./index-a.js', './index-b.js'],
    output: {
      path: path.resolve(__dirname, '_build/assets/js'),
      filename: 'bundle.js'
    }
  }))
  .ignore(path.resolve( __dirname, 'source/js/webpack-components' ))
  // HTML
  .use(markdown({
    html: true,
    xhtmlOut: true,
    typographer: true,
    linkify: true
  }))
  .use(permalinks({
    pattern: ':title',
    relative: false
  }))
  .use(assets({
    source: 'templates/current/assets', // relative to the working directory
    destination: './assets' // relative to the build directory
  }))
  .use( assets({
    source: './assets', 
    destination: './assets-new' 
  }))
  /*.use(jstransformer({
    'pattern': '**',
    'layoutPattern': 'templates/current/**',
    'defaultLayout': 'templates/current/default.pug'
  }))
  .use(pug( pug_options ))*/
  .use(layouts({
    engine: 'pug',
    pretty: true,
    moment: require( 'moment'),
    contrast: require( 'get-contrast'),
    directory: 'templates/current',
    default: 'new/partials/skeleton.pug',
    pattern: '**/*.html'
  }))
  .use(drafts())
  .build(function (err) {
  if (err) {
    console.log(err)
  } 
  else {
    console.log('Metalsmith complete!\n')
    stylesheets()
    if (process.env.NODE_ENV === 'print') {
      //print()
    }
  }
})

/* PostCSS
 ******************************************************************************/

function stylesheets () {
  var css = fs.readFileSync('css/main.css', 'utf-8')

  var plugins = [
    require( 'postcss-import'),
    require( 'postcss-nested'),
    require( 'postcss-custom-properties'),
    require( 'postcss-custom-media'),
    require( 'postcss-color-function'),
    require( 'postcss-focus'),
    require( 'autoprefixer')({
      browsers: ['last 2 versions', '> 5%']
    }),
    require( 'css-mqpacker'),
    require( 'cssnano')
  ]

  if (process.env.NODE_ENV === 'production') {
    plugins.push(
      require( 'postcss-uncss')({
        html: ['_build/**/*.html']
      })
    )
  }

  postcss(plugins)
    .process(css, {
      from: 'css/main.css',
      to: '_build/css/main.css',
      map: { inline: false }
    })
    .then(function (result) {
      if (result.warnings()) {
        result.warnings().forEach(warn => {
          console.warn(warn.toString())
        })
      }
      fs.mkdirSync('_build/css')
      fs.writeFileSync('_build/css/main.css', result.css, 'utf-8')
      if (result.map) fs.writeFileSync('_build/css/main.css.map', result.map, 'utf-8')
      console.log('PostCSS Complete!\n')
    })
}

/* PDF
 ******************************************************************************/

function print () {
  var html = fs.readFileSync('_build/index.html', 'utf8')
  var options = {
    height: '11in',
    width: '8.5in',
    type: 'pdf',
    base: 'http://localhost:8008'
  }

  var server = require( 'browser-sync').create()

  server.init({
    server: '_build',
    port: 8008,
    open: false,
    ui: false
  })

  pdf.create(html, options).toFile('resume.pdf', function (err, res) {
    if (err) return console.log(err)
    server.exit()
    console.log('\nPDF generation complete!\n')
    process.exit()
  })
}
