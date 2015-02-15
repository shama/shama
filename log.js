var chalk = require('chalk')

function Log(stdout, stderr) {
  if (!(this instanceof Log)) return new Log(stdout, stderr)
  this.stdout = stdout || process.stdout
  this.stderr = stderr || process.stderr
}
module.exports = Log

Log.prototype.info = function(msg, ns) {
  if (ns) this.stdout.write(ns + '\t')
  this.stdout.write(chalk.cyan(msg))
  this.stdout.write('\n')
  return this
}

Log.prototype.err = function(err, ns, cb) {
  var msg = err.message || err
  if (ns) this.stderr.write(ns + '\t')
  this.stderr.write(chalk.red(msg))
  this.stderr.write('\n')
  if (typeof cb === 'function') cb(err)
  return this
}

Log.prototype.beep = function() {
  this.stdout.write('\x07')
  return this
}
