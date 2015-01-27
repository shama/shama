module.exports = function(cwd) {
  var build = require('./build')(cwd)
  var server = require('./server')({
    '/': 'index.html',
    '/*': './',
    cwd: cwd,
  })
  if ((process.argv[2] || '').indexOf('watch') !== -1) {
    require('./watch')({
      'app/**/*': build.all.bind(build),
      // TODO: Add restart server
      cwd: cwd,
    })
  }
  build.all(function() {
    server.start()
  })
}
