'use strict';

const dev_config = require('../config/dev.js');
const request = require('request');
const couchbase = require('couchbase');

class flusher {
    constructor(config) {
        this._config = config;
        this._issueFlushCommand = this._issueFlushCommand.bind(this);
        this._primaryIndex = this._primaryIndex.bind(this);
    }

    flush() {
        this._issueFlushCommand()
            .then(this._primaryIndex)
            .catch((err) => {
                console.log("ERR:", err);
            })
    }

    _issueFlushCommand() {
        return new Promise(
            (resolve, reject) => {
                request.post({
                    url: `http://${this._config.endPoint}/pools/default/buckets/${this._config.bucket.name}/controller/doFlush`,
                    auth: {
                        'user': this._config.user,
                        'pass': this._config.password,
                        'sendImmediately': true
                    }
                }, (err, httpResponse, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (httpResponse.statusCode == 200) {
                        console.log(`  BUCKET '${this._config.bucket.name}' FLUSHED: ${httpResponse.statusCode}`)
                        resolve(this);
                        return;
                    }
                    console.log('  ERROR FLUSHING BUCKET: ', body);
                    reject(httpResponse.statusCode)
                })
            });
    }

    // TODO: this is mostly copy/pasta from the provision code, which is copypasta
    // from the couchbase docs.  Should DRY this up, but they are doing
    // weird things with the arguments to the instance methods and passing
    // around the config data... wanted to try to clean that up here rather
    // than trying to call the messy version from here.
    _primaryIndex(resolve, reject) {
        return new Promise(
            (resolve, reject) => {
                var cluster = new couchbase.Cluster(`couchbase://${this._config.hostName}`);
                var bucket = cluster.openBucket(this._config.bucket.name, null, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    var bucketManager = bucket.manager();
                    bucketManager.createPrimaryIndex({ignoreIfExists: true}, (err) => {
                        if (err) {
                            bucket.disconnect();
                            reject(err);
                            return;
                        }
                        console.log("    CREATE PRIMARY INDEX ON BUCKET: OK");
                        bucket.disconnect();
                        resolve(this);
                    });
                });
            });
    }
}

const f = new flusher(dev_config.couchbase);
f.flush();