#!/usr/bin/env bash

set -x
set -e

sbt "gatling:testOnly nodejs.NodeJSWriteSimulation"
sbt "gatling:testOnly nodejs.NodeJSReadSimulation"
sbt "gatling:testOnly nodejs.NodeJSReadWriteSimulation"