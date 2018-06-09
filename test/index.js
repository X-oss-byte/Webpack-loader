const assert = require('assert'),
  webpack = require('webpack'),
  webpackConfig = require('./webpack.config'),
  { DUMMY_BUNDLE_NAME } = require('./config')

function normalize(str) {
  return str.trim().replace(/[\n\r]+/g, '')
}

function compile(opts) {
  webpackConfig.module.rules[0].use[0].options = opts

  if (opts && opts.hot) {
    webpackConfig.plugins = [
      new webpack.HotModuleReplacementPlugin()
    ]
  }

  const compiler = webpack(webpackConfig)
  return new Promise(resolve => {
    compiler.run(function(err, stats) {
      assert.ifError(err)
      resolve(normalize(stats.compilation.assets[DUMMY_BUNDLE_NAME].source()))
    })
  })
}

const TEST_TAG_RE = /\.tag2\("component"/
const RELOAD_TAG_RE = /\.reload\("component"\)/

describe('riot-tag-loader unit test', () => {
  it('riot loader undefined options', () => {
    return compile(undefined).then(content => {
      assert.ok(TEST_TAG_RE.test(content))
    })
  })

  it('riot loader empty options', () => {
    return compile({}).then(content => {
      assert.ok(TEST_TAG_RE.test(content))
    })
  })

  it('riot loader hot reload options', () => {
    return compile({
      hot: true
    }).then(content => {
      assert.ok(TEST_TAG_RE.test(content))
      assert.ok(RELOAD_TAG_RE.test(content))
    })
  })

  it('riot loader hot reload options as string', () => {
    return compile('hot=true').then(content => {
      assert.ok(TEST_TAG_RE.test(content))
      assert.ok(RELOAD_TAG_RE.test(content))
    })
  })

  it('riot loader hot reload options as string with question mark', () => {
    return compile('?hot=true').then(content => {
      assert.ok(TEST_TAG_RE.test(content))
      assert.ok(RELOAD_TAG_RE.test(content))
    })
  })

})
