var path = require('path')
var gaze = require('gaze')

function Watch(data) {
  if (!(this instanceof Watch)) return new Watch(data)
  data = data || {}

  this.cwd = process.cwd()
  if (data.cwd) {
    this.cwd = data.cwd
    delete data.cwd
  }

  this.watchers = []
  var keys = Object.keys(data)
  for (var i = 0; i < keys.length; i++) {
    if (!data.hasOwnProperty(keys[i])) continue
    var fn = data[keys[i]]
    var g = gaze(keys[i], {cwd:this.cwd}, function() {
      this.on('all', function() {
        fn()
      })
    })
    this.watchers.push(g)
  }

}
module.exports = Watch

Watch.prototype.close = function() {
  for (var i = 0; i < this.watchers.length; i++) {
    this.watchers.close()
  }
  this.watchers = []
  return this
}
