lazy val root = (project in file(".")).
  enablePlugins(GatlingPlugin).
  settings(
    name := "nodejs-chat-load-test",
    version := "0.1.0",
    scalaVersion := "2.11.8",

    libraryDependencies += "io.gatling.highcharts" % "gatling-charts-highcharts" % "2.2.2" % "test,it",
    libraryDependencies += "io.gatling" % "gatling-test-framework" % "2.2.2" % "test,it"
  )
