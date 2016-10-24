# nodejs-chat

This is a simple project that I put together to explore the following technologies:

* node.js
* hapi
* couchbase
* react.js

It contains a very simple node.js chat application, with:

* An HTTP endpoint for posting chat messages, which will be saved to a couchbase
  data bucket
* A few HTTP endpoints for retrieving messages
* A very basic react.js page that will render the most recent chat messages
* A Vagrant setup for provisioning the couchbase instance
* Some Gatling load tests that can test read/write performance, against either
  a single-process node.js instance or against a clustered instance

## How to run the load tests

First, you will need a couchbase instance.  The setup code in this repo assumes
a completely fresh couchbase install which has not been configured yet, so
there is an included npm task for provisioning the couchbase instance.

This app has only been tested with couchbase community edition, version 4.1.0.
You may either set up a fresh install of couchbase on a box of your choice,
or use the Vagrant setup included in the repo.  To use the vagrant box for
couchbase, from the root dir of this repo:

    cd couchbase
    vagrant up --provider virtualbox

When this command completes, the VM should be up and running, with a fresh
install of couchbase 4.1.0.  You'll need the IP address of the VM, which
should hopefully be logged near the end of the vagrant output.

NOTE: the amount of load that the app can handle in your environment will obviously
vary a great deal depending on your hardware.  My testing was all done on an
Intel i7 @3.4GHz.  You can increase or decrease the load by editing the file
`gatling/src/test/scala/nodejs/Config.scala`.

Once you have your couchbase instance available, to run the load tests, run
the following commands from the root dir of the repo:

    cd nodejs
    npm install
    npm run browserify
    COUCHBASE_HOST=<your_couchbase_ip> npm run couchbase-provision
    cd ../gatling
    COUCHBASE_HOST=<your_couchbase_ip> ./run_tests.sh

This will do the following:

* Bootstrap the couchbase instance and create a bucket called 'nodejs-chat', along
  with appropriate indexes
* Run a read/write simulation that will simulate a large number of simultaneous
  users generating chat messages
* Run a read simulation that tests the performance of a single-process nodejs
  server with this setup
* Re-run the same read simulation using a clustered nodejs server (using pm2 for the
  clustering)

The clustered tests use `pm2` with a cluster size of 8.

The output of each Gatling load test is a nice HTML report showing how the
server behaved during the course of the run.  These can be found in the
`gatling/target/gatling` directory.

You can see results from previous runs here:

* [Single-process write test](https://cprice404.github.io/nodejs-chat/gatling/target/gatling/nodejswritesimulation-1477359046632/index.html)
* [Clustered write test](https://cprice404.github.io/nodejs-chat/gatling/target/gatling/nodejswritesimulation-clustered-1477359167110/index.html)
* [Single-process read test](https://cprice404.github.io/nodejs-chat/gatling/target/gatling/nodejsreadsimulation-1477359093823/index.html)
* [Clustered read test](https://cprice404.github.io/nodejs-chat/gatling/target/gatling/nodejsreadsimulation-clustered-1477359200482/index.html)

## Observations from perf tests

One of the things I was most interested in experimenting with was how the
concurrency model of node.js compares to other backends that I have more experience
with (in particular, the JVM).  In some experiments that I did before putting
together this repo, where I used routes that simulated any sort of CPU activity
on the node.js event loop, there was a large and obvious benefit to using the
clustered node.js processes.

However, in this more full-stack example, the benefit of clustering varied
a great deal depending on whether we were reading from or writing to the database.
When comparing the clustered app to the single-process app, we see
an improvement of about 75% for the write operations, but only about 25% for the
read operations.

It's interesting that the clustering provided a much bigger boost for *write*
operations to the database than for *read* operations.  This is most likely because
the couchbase write operations are extremely fast, so the node.js CPU usage becomes
more of a bottleneck.

The couchbase read operations are significantly more expensive, so, while the clustered
server does perform a bit better, it's clear that the bottleneck is the act of reading
from the database.  Even with a single node.js process the server does a very impressive
job of keeping up with the load for pages that trigger read operations.

In fact, before some tweaks to the couchbase query, and before adding an index
for the field we are querying on, node was so much faster than the database
that there was no noticeable perf difference between the single-process and
clustered servers for pages that triggered read operations.


## How to run the server

To run in a development mode (using `nodemon` so that the server will be
automatically restarted when any code is changed):

    cd nodejs
    npm install
    npm run browserify
    COUCHBASE_HOST=<your_couchbase_ip> npm start

You can then view the react page at `http://localhost:3000`.  There is currently
no mechanism in the UI for posting messages - you can only do that via the
`/submit-message` endpoint.

## TODO:

Interesting things I'd like to add if time permits:

* Add an input method to the React GUI for submitting messages
* Add AJAX polling to the UI to periodically refresh messages
* Create a second React page that uses websockets so that new messages can be
  delivered via push notifications rather than polling
* Add Gatling tests to cover the websocket implementation and compare scalability /
  performance
* Build a simple Android GUI
* Experiment with using an AWS autoscale group and varying the Gatling load
* Automate the creation / management of the AWS autoscale group using Puppet or Ansible
