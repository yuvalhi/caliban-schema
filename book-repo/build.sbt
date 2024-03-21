import Dependencies.*
import _root_.caliban.tools.Codegen

ThisBuild / scalaVersion := "2.12.17"
ThisBuild / version := "0.1.0-SNAPSHOT"
ThisBuild / organization := "com.example"
ThisBuild / organizationName := "example"
scalacOptions ++= Seq(
  "-deprecation",
  "-feature",
  "-unchecked",
  "-Xlint",
  "-Ywarn-dead-code",
  "-Ywarn-numeric-widen",
  "-Ywarn-value-discard",
  "-Ypartial-unification",
  "-language:postfixOps",
  "-language:higherKinds"
)

lazy val root = (project in file("."))
  .enablePlugins(CalibanPlugin)
  .settings(
    name := "book-repo",
    libraryDependencies ++= calibanDep :+ (munit % Test),
    Compile / caliban / calibanSettings ++= Seq(
      calibanSetting(file("book-repo/src/main/graphql/schema.graphql"))(
        _.genType(Codegen.GenType.Schema)
          .clientName("BookRepo")
          .preserveInputNames(true)
          .enableFmt(true)
          .addDerives(true)
          .effect("example.AuthTask")
          .packageName("example")
      )
    )

  )






// See https://www.scala-sbt.org/1.x/docs/Using-Sonatype.html for instructions on how to publish to Sonatype.
