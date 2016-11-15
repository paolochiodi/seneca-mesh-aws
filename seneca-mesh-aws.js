'use strict'

const GetIp = require('aws-get-ip')
const networkAddress = require('network-address')
const DEFAULT_PORT = 39000

function addPort (port) {
  return function (ip) {
    return ip + ':' + port
  }
}

function senecaMeshAws (options) {

  const seneca = this
  const awsOpts = options.aws || {}
  const tags = options.baseTags || {mesh:'base'}

  delete options.awsOpts
  delete options.tags

  const finder = new GetIp(awsOpts)
  finder.byTags(tags, function gotIps (err, ips) {
    options.base = ips.map(addPort(DEFAULT_PORT))
    options.host = networkAddress()

    if (options.isbase) {
      options.port = DEFAULT_PORT
    }

    seneca.use('mesh', options)
  })
}

module.exports = senecaMeshAws
