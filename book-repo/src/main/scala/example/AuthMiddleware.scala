package example

import caliban.Http4sAdapter
import org.http4s.HttpRoutes
import org.typelevel.ci.CIString
import zio.{Task, ZLayer}

object AuthMiddleware {

  def apply(route: HttpRoutes[AuthTask]): HttpRoutes[Task] =
    Http4sAdapter.provideSomeLayerFromRequest[Any, AuthToken](
      route,
      _.headers.get(CIString("token")) match {
        case Some(value) => ZLayer.succeed(AuthToken(value.head.value))
        case None =>
        println("Missing token")
          ZLayer.succeed(AuthToken("hello"))
      }
    )
}
