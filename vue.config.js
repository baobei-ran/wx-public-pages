// var path = require("path")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const debug = process.env.NODE_ENV !== 'production';
const CompressionWebpackPlugin = require('compression-webpack-plugin');

var pageList = {
  index: {
    entry: './src/pages/index/main.js',
    template: 'public/index.html',
    filename: 'index.html',
    chunks: ['chunk-vendors', 'chunk-common', 'index']
  },
  uservip: {  //和路由中的命名一样
    entry: './src/pages/uservip/uservip.js', //关联对应js文件作为入口
    template: 'public/uservip.html',        // html文件名称
    filename: 'uservip.html'
  },
  pacsimage: {  //和路由中的命名一样
    entry: './src/pages/pacsimage/pacsimage.js', //关联对应js文件作为入口
    template: 'public/pacsimage.html',        // html文件名称
    filename: 'pacsimage.html'
  }
}
module.exports = {  
  // production 是代表线上的意思
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/', // 公共路径
  outputDir: "dist", // 构建输出目录
  assetsDir: "assets", // 静态资源目录 (js, css, img, fonts)
  // 配置多页面入口
  pages: pageList,
  lintOnSave: false, // 是否开启eslint保存检测，有效值：ture | false | 'error'
  runtimeCompiler: true, // 运行时版本是否需要编译
  transpileDependencies: [
    // 'benz-amr-recorder' // 打包时使用
  ], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
  productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
  configureWebpack: config => { // webpack配置，值位对象时会合并配置，为方法时会改写配置
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.plugins.push(
        new CompressionWebpackPlugin({
          // filename: info => {    // 只压缩 js
          //   return `${info.path}.gz${info.query}`
          // },
          // algorithm: 'gzip', 
          // threshold: 10240,
          // test: new RegExp(
          //   '\\.(' +
          //   ['js'].join('|') +
          //   ')$'
          // ),
          minRatio: 0.8,
            // 正在匹配需要压缩的文件后缀 所有指定的都压缩 
            test: /\.(js|css|svg|woff|ttf|json|html)$/,
            // 大于10kb的会压缩
            threshold: 10240,
            deleteOriginalAssets: false // 删除原文件
            // 其余配置查看compression-webpack-plugin
          })
        )
    }
     optimization: {
      minimizer: [
         new UglifyJsPlugin ({
           uglifyOptions: {
             compress: {
               warnings: false,
               drop_debugger: false,
               drop_console: false,
               pure_funcs: ['console.log']  // 移除 console
             },
           },
           sourceMap: false,
           parallel: true,
         })
       ]
     }
 ///////////////////////////////////////////////////////////////
    if (debug){ // 开发环境配置
      config.devtool = 'cheap-module-eval-source-map'
     
    } else { // 生产环境配置
      
    }
    // Object.assign(config,{ // 开发生产共同配置，配置别名
    //   resolve: {
    //     alias: {
    //       "@": path.resolve(__dirname, './src'),
    //       "@c": path.resolve(__dirname, './src/components'),
    //       "vue$": "vue/dist/vue.esm.js"
    //     }
    //   }
    // })

},
  chainWebpack: config => { // webpack链接API，用于生成和修改webapck配置
    config.plugins.delete('prefetch');  // 删除 prefetch(预先加载模块)
    config.entry = {
      app: ['@babel/polyfill', './src/main.js'],
      app: ['@babel/polyfill', './src/uservip.js'],
      app: ['@babel/polyfill', './src/pacsimage.js']
    }
    //修复 Lazy loading routes Error
    // config.plugin('html').tap(args => { // 多页面就报错，适合单页面
    //   args[0].chunksSortMode = 'none';
    //   return args;
    // });
    // 开启图片压缩
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({ bypassOnDebug: true })
        .end()
  
    if (debug) {
      // 本地开发配置
    } else {
      // 生产开发配置   
      /* 添加分析工具  启动命令：npm run build --report */
      if (process.env.npm_config_report) {
        config.plugin('webpack-bundle-analyzer')
            .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
            .end();
      }
      
      // 用cdn方式引入
      config.externals({
        'vue': 'Vue',
        'vue-router': 'VueRouter',
      })
    }
  },
  parallel: require("os").cpus().length > 1, // 构建时开启多进程处理babel编译
  pluginOptions: { // 第三方插件配置
  },
  pwa:{},
  devServer: {
    index: "index.html", // 默认启动serve 打开index页面
    open: true,
    // host: "192.168.1.8",
    // host: "192.168.1.151",
    // host: "localhost",
    port: 8080,
    https: false,
    hotOnly: false,
    proxy:{ // 配置跨域
      "/api": { // 要访问的跨域的api的域名
        target: "http://test99.yunyikang.cn",
        ws: true,
        changOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    },
    before: app => {}
  }
}