var path = require('path')
var fs = require('fs')
var browserify = require('browserify')
var stylus = require('stylus')
var nib = require('nib')

function Build(cwd) {
  if (!(this instanceof Build)) return new Build(cwd)
  this.cwd = cwd || process.cwd()
  this.defaults = {
    css: {
      src: 'app/css/index.styl',
      dest: 'index.css',
    },
    js: {
      src: 'app/index.js',
      dest: 'index.js',
    },
    html: {
      dest: 'index.html',
      title: '',
    },
  }
}
module.exports = Build

Build.prototype.all = function(opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  cb = cb || function() {}
  opts = opts || {}
  count = 3
  function done() {
    count--
    if (count < 1) cb()
  }
  return this
    .css(opts.css, done)
    .js(opts.js, done)
    .html(opts.html, done)
}

Build.prototype.css = function(opts, cb) {
  cb = cb || function() {}
  opts = opts || {}
  var src = path.resolve(this.cwd, opts.src || this.defaults.css.src)
  var dest = path.resolve(this.cwd, opts.dest || this.defaults.css.dest)
  var styl = stylus(src, opts)
  styl.use(nib())
  styl.render(function(err, css) {
    if (err) return cb(err)
    fs.writeFile(dest, css, function(err) {
      if (err) return cb(err)
      cb(null, css)
    })
  })
  return this
}

Build.prototype.js = function(opts, cb) {
  cb = cb || function() {}
  opts = opts || {}
  var src = path.resolve(this.cwd, opts.src || this.defaults.js.src)
  var dest = path.resolve(this.cwd, opts.dest || this.defaults.js.dest)
  var b = browserify(opts)
  b.add(src)
  b.bundle(function(err, js) {
    if (err) return cb(err)
    fs.writeFile(dest, js, function(err) {
      if (err) return cb(err)
      cb(null, js)
    })
  })
  return this
}

Build.prototype.html = function(opts, cb) {
  cb = cb || function() {}
  opts = opts || {}
  var dest = path.resolve(this.cwd, opts.dest || this.defaults.html.dest)
  var tpl = [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="utf-8">',
    '  <meta http-equiv="X-UA-Compatible" content="IE=edge">',
    '  <meta http-equiv="Content-Language" content="en">',
    '  <title>' + (opts.title || this.defaults.html.title) + '</title>',
    '  <link type="text/css" rel="stylesheet" media="all" href="' + (opts.css || this.defaults.css.dest) + '">',
    '</head>',
    '<body>',
    '  <script src="' + (opts.js || this.defaults.js.dest) + '"></script>',
    '</body>',
    '</html>',
  ].join('\n')
  fs.writeFile(dest, tpl, function(err) {
    if (err) return cb(err)
    cb(null, tpl)
  })
  return this
}
