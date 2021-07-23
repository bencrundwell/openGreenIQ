module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  configureWebpack: {
    devtool: 'source-map',
      devServer: {
        // port: 8081,
        public: "localhost"
    }
  }
}
