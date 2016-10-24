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
    node src/server.js > >(./node_modules/.bin/bunyan > nodejs.log) &
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


flush_couch
sleep 5
start_node
sleep 5
sbt "gatling:testOnly nodejs.NodeJSWriteSimulation"
#sbt "gatling:testOnly nodejs.NodeJSReadWriteSimulation"
sleep 5
sbt "gatling:testOnly nodejs.NodeJSReadSimulation"
stop_node
flush_couch
sleep 5
start_cluster
sleep 5
sbt "gatling:testOnly nodejs.NodeJSWriteSimulation_Clustered"
sleep 5
sbt "gatling:testOnly nodejs.NodeJSReadSimulation_Clustered"
stop_cluster