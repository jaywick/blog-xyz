# blog-xyz
Public fork of my http://jaywick.xyz site

# Prerequisites
* mongodb
* Typescript 1.8+
* Node 5+
* vscode (optional, but seriously recommended)

Get the packages dependancies

    npm install 

Globals

    npm install typescript -g
    npm install es6-promise -g
    npm install mongodb -g

The build process simply involves transpiling Typescript to JS

    tsc -p .

With `mongod` running, run

    node entry.js

Or in vscode simply click <kbd>F5</kbd> to debug using Node.

# License

This code is protected by [GPL3](LICSENSE).
