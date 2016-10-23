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

start_cluster()
{
    pushd ../nodejs
    ./node_modules/.bin/pm2 start src/server.js -i max
    popd
}

stop_cluster()
{
    pushd ../nodejs
    ./node_modules/.bin/pm2 stop all
    popd
}


start_node
flush_couch
#sbt "gatling:testOnly nodejs.NodeJSWriteSimulation"
sbt "gatling:testOnly nodejs.NodeJSReadWriteSimulation"
sbt "gatling:testOnly nodejs.NodeJSReadSimulation"
stop_node
flush_couch
start_cluster
sbt "gatling:testOnly nodejs.NodeJSReadSimulation_Clustered"
stop_cluster