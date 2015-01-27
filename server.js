var path = require('path')
var jaws = require('jaws')

function Server(data) {
  if (!(this instanceof Server)) return new Server(data)
  data = data || {}
  this.cwd = process.cwd()
  if (data.cwd) {
    this.cwd = data.cwd
    delete data.cwd
  }
  this.app = jaws()
  var keys = Object.keys(data)
  for (var i = 0; i < keys.length; i++) {
    if (!data.hasOwnProperty(keys[i])) continue
    var fn = data[keys[i]]
    if (typeof fn === 'string') {
      if (fn.slice(0, 2) === './') {
        // Folders start with ./
        this.app.route(keys[i]).nocache().files(path.resolve(this.cwd, fn))
      } else {
        // Files are just strings
        this.app.route(keys[i]).nocache().file(path.resolve(this.cwd, fn))
      }
    } else {
      // Everything else is a req/res fn
      this.app.route(keys[i], fn).nocache()
    }
  }
}
module.exports = Server

Server.prototype.start = function(port, cb) {
  port = port || 8080
  this.app.httpServer.listen(port, cb || function() {})
  return this
}

Server.prototype.restart = function(cb) {
  // TODO: Write this
  return this
}
