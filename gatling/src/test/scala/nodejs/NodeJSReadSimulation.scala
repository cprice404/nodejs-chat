package nodejs

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._

class NodeJSReadSimulation extends Simulation {

  val httpConf = http
    .baseURL("http://localhost:3000") // Here is the root for all relative URLs
    //.acceptHeader("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8") // Here are the common headers
    //.acceptEncodingHeader("gzip, deflate")
    //.acceptLanguageHeader("en-US,en;q=0.5")
    //.userAgentHeader("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:16.0) Gecko/20100101 Firefox/16.0")

  val userIdFeeder = Iterator.from(1).map(i => Map("userId" -> i))

  val scn = scenario("NodeJS Chat") // A scenario is a chain of requests and pauses
    .feed(userIdFeeder)
    .repeat(Config.NUM_REPETITIONS) {
      exec(http("index")
        .get("/users/${userId}"))
    }

//  setUp(scn.inject(rampUsers(100) over (10 seconds)).protocols(httpConf))
//   setUp(scn.inject(atOnceUsers(100)).protocols(httpConf))
  setUp(scn.inject(atOnceUsers(Config.NUM_USERS)).protocols(httpConf))
}

