# Boilerplate using Gulp, ES6 and SASS

Simple boilerplate based on [dverbovyis](https://github.com/dverbovyi) [gist](https://gist.github.com/dverbovyi/7f71879bec8a16847dee). Thanks.

# Prerequisite
You need do have [`gulp-cli`](https://github.com/gulpjs/gulp-cli) somewhere installed

Download the [ZIP file](https://github.com/pixelkritzel/gulp_es6_sass_boilerplate/archive/master.zip) and change into the directory and run
```
npm install
$PATH_TO_GULP/gulp run
```

## JSX

To use it with JSX run
```
npm install --save-dev babel-preset-react
```

And replace the content of `.babelrc` with this
```
{
  "presets": [
    "es2015",
    "react"
  ]
}
```

## MobX

To use with MobX run
```
npm install --save-dev babel-preset-react babel-preset-stage-1 babel-plugin-transform-decorators-legacy
```

`.babelrc`:
```
{
  "presets": [
    "react",
    "es2015",
    "stage-1"
  ],
  "plugins": ["transform-decorators-legacy"]
}
```
