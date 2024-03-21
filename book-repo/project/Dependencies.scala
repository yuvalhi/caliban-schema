import sbt.*

object Dependencies {
  val calibanVersion = "2.5.3"
  lazy val munit = "org.scalameta" %% "munit" % "0.7.29"
  lazy val calibanDep: Seq[ModuleID] = Seq(
    "com.github.ghostdogpr" %% "caliban" % calibanVersion,
    "com.github.ghostdogpr" %% "caliban-quick" % calibanVersion,
    "com.github.ghostdogpr" %% "caliban-http4s" % calibanVersion,
    "com.github.ghostdogpr" %% "caliban-cats" % calibanVersion,
    "com.github.ghostdogpr" %% "caliban-tapir" % calibanVersion,
    "com.github.ghostdogpr" %% "caliban-tools" % calibanVersion,
    "org.http4s" %% "http4s-ember-server" % "0.23.23",
    "org.http4s" %% "http4s-dsl" % "0.23.23",
    "com.softwaremill.sttp.client3" %% "zio" % "3.9.5",
    "io.circe" %% "circe-generic" % "0.14.6",
    "com.softwaremill.sttp.tapir" %% "tapir-json-circe" % "1.10.0",
    "org.typelevel" %% "cats-mtl" % "1.4.0"
  )
}
