var path = require('path')
var fs = require('fs')
var browserify = require('browserify')
var stylus = require('stylus')
var nib = require('nib')
var log = require('./log')()

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
    if (count < 1) {
      log.beep()
      cb()
    }
  }
  return this
    .css(opts.css, done)
    .js(opts.js, done)
    .html(opts.html, done)
}

Build.prototype.css = function(opts, cb) {
  var self = this
  cb = cb || function() {}
  opts = opts || {}
  var src = this.defaulted(opts.src, 'css.src')
  var dest = path.resolve(this.cwd, opts.dest || this.defaults.css.dest)
  fs.readFile(src, function(err, stylSrc) {
    if (err) return log.err(err, 'css', cb)
    var styl = stylus(stylSrc.toString(), opts)
    styl.use(nib())
    styl.render(writeFile)
  })
  function writeFile(err, css) {
    if (err) return log.err(err, 'css', cb)
    fs.writeFile(dest, css, function(err) {
      if (err) return log.err(err, 'css', cb)
      log.info(path.relative(self.cwd, dest), 'css')
      cb(null, css)
    })
  }
  return this
}

Build.prototype.js = function(opts, cb) {
  var self = this
  cb = cb || function() {}
  opts = opts || {}
  var src = this.defaulted(opts.src, 'js.src')
  var dest = path.resolve(this.cwd, opts.dest || this.defaults.js.dest)
  var b = browserify(opts)
  b.add(src)
  b.bundle(function(err, js) {
    if (err) return log.err(err, 'js', cb)
    fs.writeFile(dest, js, function(err) {
      if (err) return log.err(err, 'js', cb)
      log.info(path.relative(self.cwd, dest), 'js')
      cb(null, js)
    })
  })
  return this
}

Build.prototype.html = function(opts, cb) {
  var self = this
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
    if (err) return log.err(err, 'html', cb)
    log.info(path.relative(self.cwd, dest), 'html')
    cb(null, tpl)
  })
  return this
}

Build.prototype.defaulted = function(val, defaultPath) {
  if (val) return val
  function woext(file) {
    return path.basename(file, path.extname(file))
  }
  var def = this.dotpath(defaultPath, this.defaults)
  if (!def) return defaultPath
  var defPath = path.resolve(this.cwd, def)
  var dir = path.dirname(defPath)
  var basename = woext(def)
  var file = fs.readdirSync(dir).reduce(function(cur, next) {
    return (woext(next) === basename) ? next : cur
  }, def)
  return path.resolve(dir, file)
}

Build.prototype.dotpath = function(p, obj) {
  return p.split('.').reduce(function(o, i) {
    return o[i]
  }, obj)
}
