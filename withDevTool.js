'use strict';

function withDevTool(nextConfig = {}) {
  return {
    ...nextConfig,
    webpack(conf, options) {
      if (options.isServer) {
        conf.devtool = 'source-map';
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(conf, options);
      }

      return conf;
    },
  };
}

module.exports = withDevTool;