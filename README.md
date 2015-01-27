# shama

Things for helping me build other things.

> Have an opinion on my things? Great! Fork and publish your own thing.

## quick start

```shell
npm init
npm i shama --save-dev
./node_modules/.bin/shama
npm run watch
```

### `require('shama')`

Create something like this or use `./node_modules/.bin/shama`:

```shell
./
├── app
│   ├── css
│   │   └── index.styl
│   └── index.js
├── bin
│   └── build.js
└── package.json
```

**`bin/build.js`**

```js
var path = require('path')
require('shama')(path.resolve(__dirname, '..'))
```

**`package.json`**

```json
{
  "name": "thing",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "build": "node bin/build.js",
    "watch": "node bin/build.js watch"
  }
}
```

### `require('shama/build')`

```js
// Compile a index.html, index.js and index.css file
// using browserify and stylus
var build = require('shama/build')()
build.css().js().html()

// or more simply
build.all()

// or more complexly
build.all({
  js: { src: 'app/index.js', dest: 'dist/index.js' },
  css: { src: 'app/index.styl', dest: 'dist/index.css' },
  html: { dest: 'dist/index.html', title: 'My website' },
}, function(err) {
  console.log('done!')
})
```

### `require('shama/server')`

```js
// Starts a server using jaws on port 8080
var server = require('shama/server')({
  // Default is index.html
  '/': 'index.html',
  // Serve up static files from cwd
  '/*': './',
  // Write your own req/res handlers
  '/api/:endpoint': function(req, res) {
    var params = req.extras.params
    res.json({ params.endpoint: true })
  }
})
server.start(8080)
```

### `require('shama/watch')`

```js
require('shama/watch')({
  'app/**/*': build.all.bind(build),
})
```

## license

Copyright (c) 2015 Kyle Robinson Young  
Licensed under the MIT license.
