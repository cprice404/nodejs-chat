'use strict'

const dev_config = require('../config/dev.js');
const request = require('request');
const couchbase = require('couchbase');


class cluster {
    constructor(config) {
        // local json object for Class properties.  ES6 does not
        //  include support for class properties beyond setter/getters.
        //  The constructor instantiates a "config" and passes this
        //  through the provisioning process.

        var locals = {};
        locals.endPoint = config.couchbase.endPoint;
        locals.endPointQuery = config.couchbase.n1qlService;
        locals.endPointFts = config.couchbase.ftsService;
        locals.hostName = config.couchbase.hostName;
        locals.bucket = config.couchbase.bucket;
        locals.user = config.couchbase.user;
        locals.password = config.couchbase.password;
        locals.indexMemQuota = config.couchbase.indexMemQuota;
        locals.dataMemQuota = config.couchbase.dataMemQuota;
        locals.ftsMemQuota = config.couchbase.ftsMemoryQuota;
        locals.checkInterval = 2000;

        this._locals = locals;
    }

    provision() {
        // Load locals to pass through provisioning sequence
        var locals = this.locals;

        // resolve path issues
        this._resolvePaths(locals);

        // Provision promise chain sequence.  Without binding "this",
        //  scope is not preserved from the caller each time a new
        //  promise is instantiated.

        this._verifyNodejsVersion(locals)
            .then(this._instanceExists)
            .then(this._verifyCouchbaseVersion.bind(this))
            .then(this._rename)
            .then(this._services.bind(this))
            .then(this._memory)
            .then(this._admin)
            .then(this._bucket)
            .then(this._loaded.bind(this))
            .then(this._primaryIndex.bind(this))
            .then(this._finish.bind(this))
            .catch((err) => {
                console.log("ERR:", err)
            });
    }

    get locals() {
        return this._locals;
    }

    _resolvePaths(locals) {
        // Check for custom datapath, otherwise assign to platform default
        if (locals.dataPath == "") {
            if (process.platform == 'darwin') {
                locals.dataPath = "/Users/" + process.env.USER +
                    "/Library/Application Support/Couchbase/var/lib/couchbase/data";
            } else {
                locals.dataPath = "/opt/couchbase/var/lib/couchbase/data";
            }
        }
        // Check for custom indexpath, otherwise assign to platform default
        if (locals.indexPath == "") {
            if (process.platform == 'darwin') {
                locals.indexPath = "/Users/" + process.env.USER +
                    "/Library/Application Support/Couchbase/var/lib/couchbase/data";
            } else {
                locals.indexPath = "/opt/couchbase/var/lib/couchbase/data";
            }
        }
    }

    _rename(locals) {
        return new Promise(
            (resolve, reject) => {
                request.post({
                    url: 'http://' + locals.endPoint + '/node/controller/rename',
                    form: {
                        hostname: locals.hostName
                    }
                }, (err, httpResponse, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log("  PROVISION RENAMING:", httpResponse.statusCode);
                    if(httpResponse.statusCode!=200) console.log("    WARNING:",body);
                    resolve(locals);
                });
            });
    }

    _services(locals) {
        return new Promise(
            (resolve, reject) => {
                var data = {
                    services:'kv,n1ql,index'
                };

                if (locals.ftsMemQuota != "0" && locals.instanceVersion>=4.5) data["services"] += ",fts";

                request.post({
                    url: 'http://' + locals.endPoint + '/node/controller/setupServices',
                    form: data
                }, (err, httpResponse, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log("  PROVISION SERVICES:", httpResponse.statusCode);
                    if(httpResponse.statusCode!=200) console.log("    WARNING:",body);
                    resolve(locals);
                });
            });
    }

    _memory(locals) {
        return new Promise(
            (resolve, reject) => {
                var data = {
                    indexMemoryQuota: locals.indexMemQuota,
                    memoryQuota: locals.dataMemQuota
                };

                if (locals.ftsMemQuota != "0" && locals.instanceVersion>=4.5)
                    data["ftsMemoryQuota"] = locals.ftsMemQuota;

                request.post({
                    url: 'http://' + locals.endPoint + '/pools/default',
                    form: data
                }, (err, httpResponse, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log("  PROVISION MEMORY:", httpResponse.statusCode);
                    if(httpResponse.statusCode!=200) console.log("    WARNING:",body);
                    resolve(locals);
                });
            });
    }

    _admin(locals) {
        return new Promise(
            (resolve, reject) => {
                request.post({
                    url: 'http://' + locals.endPoint + '/settings/web',
                    form: {
                        password: locals.password,
                        username: locals.user,
                        port: 'SAME'
                    }
                }, (err, httpResponse, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log("  PROVISION ADMIN USER:", httpResponse.statusCode);
                    if(httpResponse.statusCode!=200) console.log("    WARNING:",body);
                    resolve(locals);
                });
            });
    }

    _bucket(locals) {
        return new Promise(
            (resolve, reject) => {
                request.post({
                    url: 'http://' + locals.endPoint + '/pools/default/buckets',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    form: {
                        authType: "none",
                        name: locals.bucket.name,
                        proxyPort: locals.bucket.proxyPort,
                        ramQuotaMB: locals.bucket.ramQuotaMB,
                        flushEnabled: 1,
                    },
                    auth: {
                        'user': locals.user,
                        'pass': locals.password,
                        'sendImmediately': true
                    }
                }, (err, httpResponse, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log("  PROVISION BUCKET:", httpResponse.statusCode);
                    if (httpResponse.statusCode == 202) {
                        resolve(locals);
                    } else {
                        console.log("    WARNING:", body);
                        reject(httpResponse.statusCode);
                    }

                });
            });
    }

    _bucketOnline() {
        return new Promise(
            (resolve, reject)=> {
                request.get({
                    url: "http://" + this.locals.endPoint + "/pools/default/buckets/" + this.locals.bucket.name,
                    auth: {
                        'user': this.locals.user,
                        'pass': this.locals.password,
                        'sendImmediately': true
                    }
                }, (err, httpResponse, body) => {
                    if (err) {
                        resolve(false);
                        return;
                    }
                    resolve(true);
                });
            });
    }


    _loaded() {
        return new Promise(
            (resolve, reject)=> {
                this.locals.timerLoop = setInterval(()=> {
                    this._bucketOnline().then((loaded)=> {
                        if (loaded) {
                            clearInterval(this.locals.timerLoop);
                            console.log("    BUCKET:", this.locals.bucket.name, "LOADED.");
                            resolve(this.locals);
                            return;
                        }
                    });
                }, this.locals.checkInterval);
            }
        );
    }

    _primaryIndex(locals) {
        return new Promise(
            (resolve, reject) => {
                var cluster = new couchbase.Cluster(`couchbase://${locals.hostName}`);
                var bucket = cluster.openBucket(locals.bucket.name, null, (err) => {
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
                        resolve(locals);
                    });
                });
            });
    }

    _verifyNodejsVersion(locals) {
        return new Promise(
            (resolve, reject)=> {
                if (parseInt(((process.version).split("v"))[1].substr(0, 1)) < 4) {
                    reject("\n  The nodejs version is too low.  This application requires\n" +
                        "  ES6 features in order to provision a cluster, specifically: \n" +
                        "    --promises \n    --arrow functions \n    --classes \n" +
                        "  Please upgrade the nodejs version from:\n    --Current " +
                        process.version + "\n    --Minimum:4.0.0");
                } else resolve(locals);
            });
    }

    _verifyCouchbaseVersion(locals){
        return new Promise(
            (resolve, reject)=> {
                request.get({
                    url: "http://" + this.locals.endPoint + "/pools",
                    auth: {
                        'user': this.locals.user,
                        'pass': this.locals.password,
                        'sendImmediately': true
                    }
                }, (err, httpResponse, body) => {
                    if (err) {
                        resolve(false);
                        return;
                    }
                    var ver = (JSON.parse(body).implementationVersion).split(".",2);
                    this._instanceVersion=parseFloat(ver[0]+"."+ver[1]);
                    resolve(locals);
                });
            });
    }

    _instanceExists(locals) {
        return new Promise(
            (resolve, reject) => {
                request.get({
                    url: "http://" + locals.endPoint + "/pools/default/buckets/",
                    auth: {
                        'user': locals.user,
                        'pass': locals.password,
                        'sendImmediately': true
                    }
                }, (err, httpResponse, body) => {
                    if (err) {
                        reject("COUCHBASE INSTANCE AT " + locals.endPoint + " NOT FOUND.");
                        return;
                    }
                    body = JSON.parse(body);
                    for (var i = 0; i < body.length; i++) {
                        if (body[i].name == locals.sampleBucket) {
                            reject("\n  This application cannot provision an already built cluster.\n" +
                                "    BUCKET:" + locals.sampleBucket + " on CLUSTER " +
                                locals.endPoint + " EXISTS\n  The cluster has not been modified.\n" +
                                "  To run the travel-sample application run 'npm start'");
                        }
                    }
                    resolve(locals);
                });
            });
    }

    _finish() {
        return new Promise(
            (resolve, reject)=> {
                console.log("\nCluster " + this.locals.endPoint + " provisioning complete. \n" +
                    "   To login to couchbase: open a browser " + this.locals.endPoint + "\n" +
                    "   To run the nodejs-chat application, run 'npm start'");
                resolve("ok");
            });
    }

}

const c = new cluster(dev_config);
c.provision();
