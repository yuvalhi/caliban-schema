package example

import caliban.interop.tapir.HttpInterpreter
import caliban.{CalibanError, GraphQL, Http4sAdapter}
import com.comcast.ip4s.IpLiteralSyntax
import fs2.io.net.Network
import org.http4s.Challenge
import org.http4s.dsl.Http4sDsl
import org.http4s.ember.server.EmberServerBuilder
import org.http4s.headers.`WWW-Authenticate`
import org.http4s.server.Router
import zio.interop.catz._
import zio.{Scope, Task, ZIO, ZIOAppArgs, ZIOAppDefault}

object dsl extends Http4sDsl[Task]
import example.dsl._

object BookRepoMain extends ZIOAppDefault {

  import sttp.tapir.json.circe._

  implicit lazy val network: Network[Task] = Network.forAsync

  override def run: ZIO[Any with ZIOAppArgs with Scope, Any, Any] =
    (for {
      interpreter <- ZIO.serviceWithZIO[GraphQL[AuthToken]](_.interpreter)
      _ <- EmberServerBuilder
        .default[Task]
        .withErrorHandler { case e =>
          e match {
            case example.UserUnauthorized()
            =>
              println("Unauthorized1111")
              dsl.Unauthorized(`WWW-Authenticate`(Challenge("Bearer",
                  "example.com",
                  Map("realm" -> "Access to the protected resource"))))
                .map(a => {
                  println(a)
                  a
                })
            case MissingToken()
            =>
              println("Forbidden1111")
              Forbidden()
            case example.BookNotFound(message)
            =>
              println(message)
              dsl.NotFound(message)
            case a =>
              println(a)
              dsl.InternalServerError(a.getMessage)

          }
        }
        .withHost(host"localhost")
        .withPort(port"8088")
        .withHttp2
        .withHttpApp(
          Router[Task](
            "/api/graphql" -> AuthMiddleware(Http4sAdapter.makeHttpService(HttpInterpreter(interpreter
              .mapError((e: CalibanError) => {
                e match {
                  case a @ CalibanError.ExecutionError(_,_,_,Some(BookNotFound(message)),_) =>
                    a.copy(msg = message)
                  case _ => e
                }
              })
            )))
          ).orNotFound
        )
        .build
        .useForever
    } yield ()
      ).provide(BookRepository.layer, BookRepoApi.layer)
}
