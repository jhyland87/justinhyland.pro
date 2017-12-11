
const _                 = require('lodash')
const handlebars        = require('handlebars')

const Metalsmith        = require('metalsmith')
const collections       = require('metalsmith-collections')
const markdown          = require('metalsmith-markdown')
const layouts           = require('metalsmith-layouts')
const permalinks        = require('metalsmith-permalinks')
const tidy              = require('metalsmith-html-tidy')
const debug             = require('metalsmith-debug')
const models            = require('metalsmith-models')
const within            = require('metalsmith-handlebars-within')
const assets            = require('metalsmith-assets')
const templates         = require('metalsmith-templates')
const inplace           = require('metalsmith-in-place')
const date              = require('metalsmith-build-date')
const more              = require('metalsmith-more')
const gravatar          = require('metalsmith-gravatar')
const writemetadata     = require('metalsmith-writemetadata')
const copy              = require('metalsmith-copy')
const jsonFiles         = require('metalsmith-json')
const jsonToFiles       = require('metalsmith-json-to-files')
const tojson            = require('metalsmith-to-json')
const metadata          = require('metalsmith-metadata')
const metafiles         = require('metalsmith-metafiles')
const dateFormatter     = require('metalsmith-date-formatter')
const gist              = require('metalsmith-gist')
const include           = require('metalsmith-include')
const s3                = require('metalsmith-s3')
const googleAnalytics   = require('metalsmith-google-analytics')
const partial           = require('metalsmith-partial')
const discoverPartials  = require('metalsmith-discover-partials')
const sass              = require('metalsmith-sass')
const partials          = require('metalsmith-jstransformer-partials')
const jstransformer     = require('metalsmith-jstransformer')
const summary           = require('metalsmith-summary')
const download          = require('metalsmith-download')
const archive           = require('metalsmith-archive')
const prompt            = require('metalsmith-prompt')

handlebars.registerHelper('iftt', function (item, comparison, options) {
    if (item == comparison) {
        return options.fn(this)
    } else {
        return options.inverse(this)
    }
})

handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context)
})

const metalsmith = Metalsmith(__dirname)

metalsmith
    .use( summary.init() )
    .use( debug() )
    /*.metadata({
        title: "Test Page",
        description: "Just testing metalsmith"
    })*/
    .use( models({ 
        directory: './models' 
    }))
    .use( metafiles('models', {
        postfix: '.custom',
        parsers: {
            ".json": true
        }
    }))
    /*.use(gist({
        debug: true,
        caching: true,
        cacheDir: '.gists'
    }))*/
    /*.use(dateFormatter({
        dates: [
            {
                key: 'beginDate',
                format: 'MM YYYY'
            },
            {
                key: 'endDate',
                format: 'MM YYYY'
            },
            {
                key: 'publishDate',
                format: 'MM YYYY'                
            }
        ]
    }))*/
    .use( assets({
        source: './models',
        destination: './json'
    }))
    .source( './src' )
    .destination( './public' )
    .clean( true )
    /*.use(prompt({
        deploy: 'boolean'
    }))*/
    //.use(googleAnalytics('API-KEY'))
    .use( archive())
    .use( download({
        url: 'http://www.justinhyland.com/me.jpg',
        file: 'me-avatar.jpg'
    }))
    .use( include())
    .use( date() )
    .use( gravatar({
        justinhyland: "j@linux.com"
    }))
    .use( discoverPartials({
        directory: 'layouts',
        pattern: /\.html$/
        //directory: 'src',
        //pattern: /\.md$/
    }))
    .use( inplace({
        engine: 'handlebars'
    }))
    .use( templates( 'handlebars' ) )
    .use( assets({
        source: './assets', 
        destination: './assets' 
    }))
    .use(sass({
        outputStyle: 'expanded',
        outputDir: 'assets/css/'
    }))
    .use( markdown() )
    .use( within() )
    .use( partial({
        directory: './partials', 
        engine: 'handlebars'
    }))
    .use( discoverPartials({
        directory: 'layouts/partials',
        pattern: /\.html$/
    }))
    .use( jstransformer())
    .use( partials())
    .use( layouts({ 
        engine: 'handlebars'
    }))
    .use( tidy({
        tidyOptions: {
            'indent-spaces': 4
            ,'clean': true
            ,'output-html': true
            //,'hide-comments': true
            ,'show-errors': 6
            //,'show-info': true
            //,'show-warnings': true
            ,'uppercase-attributes': false
            ,'uppercase-tags': false
            //,'drop-empty-elements': false
            ,'drop-empty-paras': true
            ,'fix-backslash': false
            ,'fix-bad-comments': false
            ,'fix-uri': false
            ,'join-styles': false
            ,'lower-literals': false
            ,'merge-divs': false
            ,'merge-emphasis': false
            ,'merge-spans': false
        }
    }))/*
    .use( s3({
        action: 'write',
        bucket: 'justinhyland.com'
    }))*/
    .use( summary.print())
    .build( function(err, files) {
        //console.log('metalsmith:',metalsmith)
        //console.log('partials:',Object.keys(handlebars.partials))

        if (err) throw err


        console.log('Completed')
    })