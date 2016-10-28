/**
 * Created by slashhuang on 16/10/8.
 */

var path =require('path');
module.exports = {
    entry: {
        'bundle':"./index.js"
    },
    output: {
        publicPath:'/dist/',
        path: path.join(__dirname,'dist'),
        filename: "[name].js"
    },
    module: {
        loaders: [
            {   test: /\.js$/,
                loader: "babel-loader"
            },
        ],
        resolve: {
            extensions: ['', '.js', '.jsx']
        }
    }
};
