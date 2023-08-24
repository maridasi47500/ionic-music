 var webpack = require('webpack');
 var TerserPlugin = require('terser-webpack-plugin')

 console.log('The custom config is used');
 module.exports = {
   optimization: {
     minimize: true,
     minimizer: [
       new TerserPlugin({
         terserOptions: {
           keep_classnames: true,
           keep_fnames: true,
         },
       }),
     ],
   },
   experiments: {
  topLevelAwait: true
},
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [],
            },
            // ...
        ],
    },
      externals: {
        "react-native": true,
    },
         resolve: {
        alias: {
            'react-native$': 'react-native-web'
        }
    },
   plugins: [
       new webpack.NormalModuleReplacementPlugin(/typeorm$/, function (result) {
           result.request = result.request.replace(/typeorm/, "typeorm/browser");
       })
   ],
 };


