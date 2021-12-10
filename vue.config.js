'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
const argv = require('yargs').argv

function resolve (dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title// page title

// 取自.env.xxx环境文件的 port || npm_config_port 的值设置
const port = process.env.port || process.env.npm_config_port || 8002 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  publicPath: argv.preview ? '/' : './', // argv为保存命令行参数的对象,argv.preview用于yarn run preview
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: argv.mode === 'test', // 24:test环境下设置为true，方便浏览器代码调试
  css: {
    sourceMap: process.env.NODE_ENV === 'development', // 本地开发开启css映射
    loaderOptions: {
      sass: {
        prependData: '@import "@/styles/variables.scss";' // 全局scss
      }
    }
  },
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    disableHostCheck: true,
    proxy: {
      '/popularize-admin-api': {
        target: 'http://api-ferriswheel-test.sylstock.com',
        changeOrigin: true,
        pathRewrite: {
          '^/popularize-admin-api': '/'
        }
      }
    }
    // after: require('./mock/mock-server.js')
  },
  configureWebpack: {
    name: name,
    externals: {
      echarts: 'echarts'
    },
    resolve: {
      alias: {
        '@': resolve('src'),
        '@landing': resolve('src/views/utilityTools/h5Site')
      }
    }
  },
  chainWebpack: (config) => {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader: <svg-icon icon-class="search"></svg-icon>
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace 修改vue-loader的模板编译选项:设置模板标签间空格
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development 开发环境下映射模式: 只映射行
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          // 打包生成的 runtime.js非常的小，gzip 之后一般只有几 kb，但这个文件又经常会改变，我们每次都需要重新请求它，它的 http 耗时远大于它的执行时间了，所以建议不要将它单独拆包，而是将它内联到我们的 index.html 之中(index.html 本来每次打包都会变); script-ext-html-webpack-plugin还支持preload和 prefetch,是html-webpack-plugin的扩展插件https://www.npmjs.com/package/script-ext-html-webpack-plugin
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html') // 在HtmlWebpackPlugin之后引用
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single') // 提取runtime~xxx.js文件,避免文件频繁变更导致浏览器缓存失效. runtime代码(b文件中import('./a').then()或者动态路由),配置runtimeChunk('single')后, 将chunks依赖关系提取出来runtime.js, 未设置时,a/b文件有一个变更都会触发重新请求双文件,因为被打包在了一起, 提取后,b文件变更,只会影响b.js和runtime.js的hash变化且重新请求,a文件的变化同理引起a的包和runtime.js的重新请求. ----针对都会引起runtime.js的重新请求,实际上runtime.js的包只是chunk依赖关系的文件, 请求时间远大于运行时间,所以将其内联到index.html中而不单独打包,使用上面的script-ext-html-webpack-plugin
        }
      )
  }

}
