const path = require('path');
const buildType = process.argv.splice(2)[0];
console.log(buildType);

const bas = {
  entry: 'client/index.js',
  define: {
    // 此处不能省略 JSON.stringify，否则构建过程会出现语法问题
    ASSETS_TYPE: JSON.stringify('pbills'),
    BUILD_TYPE: JSON.stringify(''),
  },
  plugins: [
    ['ice-plugin-fusion', {
      themePackage: '@icedesign/theme',
    }],
    ['ice-plugin-moment-locales', {
      locales: ['zh-cn'],
    }],
  ],
  chainWebpack: (config, { command }) => {
    config.plugin('HtmlWebpackPlugin').tap(args => {
      return args;
    });

    if (command === 'build') {
      config.module
        .rule('obfuscator-loader')
        .test(/\.js$/)
        .pre()
        .include
        .add(path.resolve(__dirname, "client/layouts/BasicLayout/components/Aside"))
        .add(path.resolve(__dirname, "client/utils/basCoord.js"))
        .end()
        .enforce('post')
        .use('obfuscator-loader')
        .loader('obfuscator-loader')
        .options({ debugProtection: true, log: true, debugProtectionInterval: true })
    }
  },
};
const pbas = {
  entry: 'client/index.js',
  define: {
    // 此处不能省略 JSON.stringify，否则构建过程会出现语法问题
    ASSETS_TYPE: JSON.stringify('pbills'),
    BUILD_TYPE: JSON.stringify('pbills'),
  },
  plugins: [
    ['ice-plugin-fusion', {
      themePackage: '@icedesign/theme',
    }],
    ['ice-plugin-moment-locales', {
      locales: ['zh-cn'],
    }],
  ],
  chainWebpack: (config, { command }) => {
    config.plugin('HtmlWebpackPlugin').tap(args => {
      return args;
    });

    if (command === 'build') {
      config.module
        .rule('obfuscator-loader')
        .test(/\.js$/)
        .pre()
        .include
        .add(path.resolve(__dirname, "client/layouts/BasicLayout/components/Aside"))
        .add(path.resolve(__dirname, "client/utils/basCoord.js"))
        .end()
        .enforce('post')
        .use('obfuscator-loader')
        .loader('obfuscator-loader')
        .options({ debugProtection: true, log: true, debugProtectionInterval: true })
    }
  },
};
const bbas = {
  entry: 'client/index.js',
  define: {
    // 此处不能省略 JSON.stringify，否则构建过程会出现语法问题
    ASSETS_TYPE: JSON.stringify('bbills'),
    BUILD_TYPE: JSON.stringify('bbills'),
  },
  plugins: [
    ['ice-plugin-fusion', {
      themePackage: '@icedesign/theme',
    }],
    ['ice-plugin-moment-locales', {
      locales: ['zh-cn'],
    }],
  ],
  chainWebpack: (config, { command }) => {
    config.plugin('HtmlWebpackPlugin')
      .tap(args => {
        args[0].template = path.resolve(__dirname, "client/tas/index.html");
        console.log(args);
        // 根据需求返回 WebpackPluginImport 插件构造函数的参数
        return args;
      });
  },
};
const bs = {
  entry: 'client/CTSearch/index.js',
  plugins: [
    ['ice-plugin-fusion', {
      themePackage: '@icedesign/theme',
    }],
    ['ice-plugin-moment-locales', {
      locales: ['zh-cn'],
    }],
  ],
  chainWebpack: (config, { command }) => {
    config.plugin('HtmlWebpackPlugin')
      .tap(args => {
        args[0].template = path.resolve(__dirname, "client/CTSearch/index.html");
        console.log(args);
        // 根据需求返回 WebpackPluginImport 插件构造函数的参数
        return args;
      });
  },
};
if (buildType === 'bbas') {
  module.exports = bbas;
} else if (buildType === 'pbas') {
  module.exports = pbas;
} else if (buildType === 'bs') {
  module.exports = bs;
} else {
  module.exports = bas;
}

