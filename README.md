# blog-xyz
Public fork of my http://jaywick.xyz site

# Prerequisites
* mongodb
* Node 5.7.0+
* vscode for development (optional, but seriously recommended)

Install global packages

    npm install typescript@1.8.10 -g
    npm install es6-promise -g
    npm install mongodb -g
    npm install typings -g
    npm install forever -g

Get the packages dependancies

    npm install 

Get typings

    typings install

The build process simply involves transpiling Typescript to JS

    tsc -p .

With `mongod` running, run

    forever start entry.js

Or to debug vscode simply click <kbd>F5</kbd> to launch Node and attach to process.

Stop the forever script using

    forever stop entry.js

# License

This code is protected by [GPL3](LICSENSE).
