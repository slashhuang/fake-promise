/**
 * Created by slashhuang on 16/10/8.
 */

var path =require('path');
module.exports = {
    entry:{
        index:'./'+process.argv[process.argv.length-1]+'.js'
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
