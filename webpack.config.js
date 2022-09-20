const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    mode: 'production',
    //production
    entry: {
        index: __dirname + '/index.js'
    },
    output: {
        path: __dirname + '/dist',//产出路径，一般放在dist目录下
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: 'babel-loader'
            }
        ]
    },
    resolve: {
        fallback: {
            crypto: false,
            stream: false,
            assert: false,
            http: false,
            https: false
           // "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
        } 
    },
    optimization: {
        minimizer: [new TerserPlugin({
            // sourceMap: true,
            // terserOptions: {
            //     safari10: true
            // }
        })],
    }
}