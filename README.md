WebPack/Babel template to bundle resources in hot-loader for React Typescript and Stylesheets (css, scss, sass)

# 1. Using the template
## Initialize
Clone the repository from github then run the command
```bash
npm install
```
## Supported Commands (defined in package.json)
```bash
# Build development only (output to /wwwroot)
npm run build

# Build production release (output to /wwwroot.prd)
# All distribution files are in wwwroot.prd
# These files can be hosted in a public HTTP server (nginx, apache, IIS,..)
npm run build-prd

# Run development server with hot-loader (running in background)
npm start

# Build production & run node http-server
# in background to test the release build
npm run start-prd
```
## Howto import Stylesheets in ts/tsx
```javascript
// Sample source for script file /script/components/*.tsx
import { IAppCss as appcss } from '../../styles/app.css';
const styles: appcss = require('../../styles/app.css');
...
return <h1 className={styles.TestCssFont}>Hello... world</h1>;
```

# 2. Create the template
```bash
# Init package json
npm init -y

# Install all babel, ts, webpack & loaders
npm install --save-dev http-server typescript webpack ts-loader webpack-dev-server babel-core babel-loader babel-preset-env extract-text-webpack-plugin file-loader style-loader css-loader source-map-loader sass-loader node-sass typings-for-css-modules-loader react-hot-loader @types/node @types/react @types/react-dom

# Install react
npm install --save react react-dom

# create tsconfig.json
node ./node_modules/typescript/lib/tsc --init
```
## Edit tsconfig.json to transpile Typescript
Typescript will transpile ts/tsx to es6, babel will handle es6 -> es5 with polyfill support. Sourcemap is turned on for ts/tsx debugging
```json
{
  "compilerOptions": {
    "target": "es6",
    "sourceMap": true,
    "jsx": "react"
  },
  "include": [
    "scripts/**/*"
  ]
}
```
## Edit package.json to add build commands
```json
"scripts": {
    "build": "export NODE_ENV=development|| set NODE_ENV=development&& webpack --progress --colors",
    "build-prd": "export NODE_ENV=production|| set NODE_ENV=production&& webpack --progress --colors",
    "start": "export NODE_ENV=development|| set NODE_ENV=development&& webpack-dev-server --hot --inline --progress --colors --open-page wwwroot/",
    "start-prd": "export NODE_ENV=production|| set NODE_ENV=production&& webpack --progress --colors&& start http://localhost:3001&& node node_modules/http-server/bin/http-server ./wwwroot.prd/ -p 3001"
},
```
## Create the project structure
```bash
.
├── fonts           # all the fonts files
├── images          # all the images files
├── styles          # all the stylesheets: css, scss, sass
├── scripts         # all the ts/stx
│   ├── components  # react components root
│   │   └── App.tsx # react App component root
│   └── app.tsx     # react main() entry-point
├── wwwroot         # debug/development output
│   └── index.html  # SPA template for development
├── wwwroot.prd     # production release output
│   └── index.html  # SPA template for production
└── README.md       # it's me
```
## Create webpack.config.js
```javascript
var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: [
        ...process.env.NODE_ENV === 'production' ? [] : ['webpack-dev-server/client?http://localhost:8080', 'webpack/hot/only-dev-server'],
        './scripts/app.tsx'
        ],
    output: process.env.NODE_ENV === 'development' ? {
        filename: 'wwwroot/app.js',
        publicPath: 'http://localhost:8080/'
    } : {
        filename: 'app.js',
        path: path.resolve(__dirname, 'wwwroot.prd/')
    },
    devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : 'hidden-source-map',
    externals: process.env.NODE_ENV === 'development' ? {} : {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    plugins: [
        ...process.env.NODE_ENV === 'development' ? [] : [ new webpack.DefinePlugin({'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV) }}), new webpack.optimize.UglifyJsPlugin() ],
        new ExtractTextPlugin(process.env.NODE_ENV === 'development' ? 'wwwroot/app.css' : 'app.css')
    ],
    resolve: {
        extensions: [".webpack.js", ".web.js", ".js", ".ts", ".tsx"]
    },
    module: {
        rules: [
            {
                test: /\.(css|sass|scss)$/,
                exclude: /(node_modules)/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'typings-for-css-modules-loader',
                            query: {
                                minimize: (process.env.NODE_ENV === 'production'),
                                modules: true,
                                sourceMap: (process.env.NODE_ENV === 'development'),
                                importLoaders: 2,
                                localIdentName: '[path]_[name]_[local]'
                            },
                        },
                        {
                            loader: 'sass-loader',
                            query: {
                                sourceMap: (process.env.NODE_ENV === 'development'),
                                sourceMapContents: (process.env.NODE_ENV === 'development'),
                            },
                        }
                    ]
                })
            },
            {
                test: /\.tsx?$/,
                exclude: /(node_modules)/,
                use: [
                    'react-hot-loader',
                    'babel-loader?presets[]=env',
                    'ts-loader'
                ]
            },
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: [
                    'babel-loader?presets[]=env',
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: 'file-loader?name=images/[name].[ext]'
            }
        ]
    }    
}
```
# 3. Tips
## Speed up npm install on Windows
To speed up super-slow **npm install** command on Windows, please using powershell by default (not standard Windows cmd interface).
In **VSCode** choose from main menu **File** - **Preferences** - **Settings** (<kbd>control</kbd> + <kbd>,</kbd>) then add or update the following setting into the **settings.json**
```json
"terminal.integrated.shell.windows": "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
```
## Change npm registry from https to https
```bash
npm config set registry http://registry.npmjs.org/ --global
```