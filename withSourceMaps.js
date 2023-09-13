'use strict';

function withSourceMaps(nextConfig = {}) {
  return {
    ...nextConfig,
    webpack(conf, options) {
      if (options.isServer) {
        conf.plugins.push(new options.webpack.SourceMapDevToolPlugin({
          filename: '[file].map[query]',
          noSources: true,
          moduleFilenameTemplate: '[resource-path]',
          sourceRoot: '../../..',
        }));
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(conf, options);
      }

      return conf;
    },
  };
}

module.exports = withSourceMaps;