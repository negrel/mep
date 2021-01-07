const path = require('path')

module.exports = {
  exclude: [
    path.join('**', 'node_modules', '**')
  ],
  plugins: [
    [
      '@snowpack/plugin-run-script', {
        cmd: 'npm run lint:fix',
        watch: 'watch "$1"'
      }
    ]
  ],
  install: [
  ],
  installOptions: {
  },
  devOptions: {
    open: 'none'
  },
  buildOptions: {
    out: 'dist',
    sourceMaps: process.env.NODE_ENV === 'development'
  },
  proxy: {
  }
}
