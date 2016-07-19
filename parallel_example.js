var fs = require('fs'); //require the file system module
var path = require('path'); //Path module provides utilities for working with file and directory paths.
var events = require('events'); //module used for handling events

var countLines = function(file, cb){
    var lines = 0;
    var reader = fs.createReadStream(file); //Create a read stream
    reader.on('end', function() {
        cb(null, lines);  //
    });
    reader.on('data', function(data) {
        lines += data.toString().split('\n').length - 1;  //As data comes in, you split the document on the newline character, and count the number of instances.
    });
    reader.on('error', function(err) {
        cb(err);
    });
};


var onReadDirComplete = function(err, files) {  //Where the parallelization happens.
    if (err) throw err;

    var totalLines = 0;
    var completed = 0;

    var checkComplete = function() {
        if (completed === files.length) {
            console.log(totalLines);
        }
    }

    files.forEach(function(file){
        countLines(path.join(process.argv[2], file), function(err, lines){
            if (err) {
                if (err.code === 'EISDIR') {
                    // Not to worry this is a subdirectory
                } else {
                    // Warn the user and continue
                    console.error(err);
                }
            } else {
                totalLines += lines;
            }
            completed += 1;
            checkComplete();
        });
    });
};

fs.readdir(process.argv[2], onReadDirComplete); //Lists the files and folders in this directory.
