var flumeView = require('flumeview-level')
var charwise = require('charwise')

module.exports = {
  name: 'gitindex',
  version: require('./package.json').version,
  manifest: {
    read: 'source',
    author: 'source'
  },
  init: function (sbot, config) {
    const view = sbot._flumeUse('gitindex', flumeView(
      1.0,
      function map (msg, seq) {
        var c = msg.value.content
        var isGitMsg = c.type in msgTypes || (c.type == 'post' && c.repo && c.issue)
        if (isGitMsg) {
          return [msg.value.timestamp, msg.value.author + charwise.encode(msg.value.sequence)]
        } else {
          return []
        }
      }
    ))

    return {
      read: view.read,
      author: function (opts) {
        opts.gt = opts.gt || 0
        opts.lt = opts.lt || 0
        opts.gt = opts.id + charwise.encode(opts.gt)
        opts.lt = opts.id + charwise.encode(opts.lt) + '~'
        return view.read(opts)
      }
    }
  }
}

var msgTypes = {
  'git-repo': true,
  'git-update': true,
  'issue': true,
  'pull-request': true
}
