#!/usr/bin/env bash

if [ -z "$COUCHBASE_HOST" ]; then
    echo "Missing required environment variable 'COUCHBASE_HOST'!"
    exit 1
fi

set -x
set -e

start_node()
{
    pushd ../nodejs
    node src/server.js > >(./node_modules/.bin/bunyan) &
    nodejs_pid=$!
    popd
}

flush_couch()
{
    pushd ../nodejs
    npm run couchbase-flush
    popd
}

stop_node()
{
    kill $nodejs_pid
}


start_node
flush_couch
sbt "gatling:testOnly nodejs.NodeJSWriteSimulation"
sbt "gatling:testOnly nodejs.NodeJSReadSimulation"
flush_couch
sbt "gatling:testOnly nodejs.NodeJSReadWriteSimulation"
stop_node