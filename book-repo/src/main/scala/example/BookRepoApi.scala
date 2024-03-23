package example

import caliban.schema.GenericSchema
import caliban.wrappers.ApolloTracing.apolloTracing
import caliban.wrappers.DeferSupport
import caliban.wrappers.Wrappers.{maxDepth, maxFields, printErrors, printSlowQueries, timeout}
import caliban.{GraphQL, RootResolver, graphQL}
import example.Types.{Book, QueryBooksArgs}
import zio.{ZIO, ZLayer, durationInt}

import language.postfixOps

object BookRepoApi {

  object AuthSchema extends GenericSchema[AuthToken]

  import caliban.schema.ArgBuilder.auto._
  import AuthSchema.auto._

  def getGraphQuery(bookRepository: BookRepository): Operations.Query = {
    Operations.Query(
      books = authenticatedBooksQuery(bookRepository)
    )
  }

  private def authenticatedBooksQuery(bookRepository: BookRepository): QueryBooksArgs => AuthTask[List[Book]] = {
    args =>
      for {
        token <- ZIO.serviceWith[AuthToken](_.token)
        _ <- ZIO.succeed(println(s"Token: $token"))
        books <- if (token == "hello")
          bookRepository.fetchBooks(args.title)
        else ZIO.fail(UserUnauthorized())
      } yield books
  }

  def makeGraphQLApi(bookRepository: BookRepository): GraphQL[AuthToken] = {
    val query: Operations.Query = getGraphQuery(bookRepository)
    val api = graphQL(RootResolver(query)) @@
      maxFields(300) @@ // query analyzer that limit query fields
      maxDepth(30) @@ // query analyzer that limit query depth
      timeout(15 seconds) @@ // wrapper that fails slow queries
      printSlowQueries(500 millis) @@ // wrapper that logs slow queries
      printErrors @@ // wrapper that logs errors
      apolloTracing() @@ // wrapper for https://github.com/apollographql/apollo-tracing
      DeferSupport.defer // wrapper that enables @defer directive support
    api
  }

  def layer: ZLayer[BookRepository, Throwable, GraphQL[AuthToken]] =
    ZLayer(ZIO.serviceWith[BookRepository](makeGraphQLApi))
}
