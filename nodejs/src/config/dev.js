"use strict";

function get_env_var(var_name) {
    var result = process.env[var_name];
    if (! result) {
        throw new Error("Missing required environment variable 'COUCHBASE_HOST'!")
    }
    return result;
}

const couchbase_host = get_env_var("COUCHBASE_HOST");

module.exports = {
    couchbase: {
        endPoint: `${couchbase_host}:8091`,
        n1qlService: `${couchbase_host}:8093`,
        ftsService: `${couchbase_host}:8094`,
        hostName: couchbase_host,
        bucket: {
            name: "nodejs-chat",
            proxyPort: 9000,
            ramQuotaMB: 256
        },
        user: "admin",
        password: "password",
        indexMemQuota: 256,
        dataMemQuota: 1024,
        ftsMemoryQuota: 0,
    }
}
