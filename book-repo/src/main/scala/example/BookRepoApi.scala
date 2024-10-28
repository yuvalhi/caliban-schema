package example

import caliban.schema.GenericSchema
import caliban.wrappers.ApolloTracing.apolloTracing
import caliban.wrappers.DeferSupport
import caliban.wrappers.Wrappers.{maxDepth, maxFields, printErrors, printSlowQueries, timeout}
import caliban.{GraphQL, RootResolver, graphQL}
import example.Types.{Book, QueryBooksArgs, QueryBookByIdArgs, QueryBooksByAuthorArgs, QueryBooksByTitleArgs, MutationAddBookArgs, MutationUpdateBookArgs, MutationDeleteBookArgs}
import zio.{ZIO, ZLayer, durationInt, Ref}
import zio.logging.{Logging, log}

import language.postfixOps

object BookRepoApi {

  object AuthSchema extends GenericSchema[AuthToken]

  import caliban.schema.ArgBuilder.auto._
  import AuthSchema.auto._

  def getGraphQuery(bookRepository: BookRepository): Operations.Query = {
    Operations.Query(
      books = authenticatedBooksQuery(bookRepository),
      bookById = authenticatedBookByIdQuery(bookRepository),
      booksByAuthor = authenticatedBooksByAuthorQuery(bookRepository),
      booksByTitle = authenticatedBooksByTitleQuery(bookRepository)
    )
  }

  def getGraphMutation(bookRepository: BookRepository): Operations.Mutation = {
    Operations.Mutation(
      addBook = authenticatedAddBookMutation(bookRepository),
      updateBook = authenticatedUpdateBookMutation(bookRepository),
      deleteBook = authenticatedDeleteBookMutation(bookRepository)
    )
  }

  private def authenticatedBooksQuery(bookRepository: BookRepository): QueryBooksArgs => AuthTask[List[Book]] = {
    args =>
      for {
        token <- ZIO.serviceWith[AuthToken](_.token)
        _ <- log.info(s"Token: $token")
        books <- if (token == "hello")
          bookRepository.fetchBooks(args.title)
        else ZIO.fail(UserUnauthorized())
      } yield books
  }

  private def authenticatedBookByIdQuery(bookRepository: BookRepository): QueryBookByIdArgs => AuthTask[Book] = {
    args =>
      for {
        token <- ZIO.serviceWith[AuthToken](_.token)
        _ <- log.info(s"Token: $token")
        book <- if (token == "hello")
          bookRepository.fetchBookById(args.id)
        else ZIO.fail(UserUnauthorized())
      } yield book
  }

  private def authenticatedBooksByAuthorQuery(bookRepository: BookRepository): QueryBooksByAuthorArgs => AuthTask[List[Book]] = {
    args =>
      for {
        token <- ZIO.serviceWith[AuthToken](_.token)
        _ <- log.info(s"Token: $token")
        books <- if (token == "hello")
          bookRepository.fetchBooksByAuthor(args.author)
        else ZIO.fail(UserUnauthorized())
      } yield books
  }

  private def authenticatedBooksByTitleQuery(bookRepository: BookRepository): QueryBooksByTitleArgs => AuthTask[List[Book]] = {
    args =>
      for {
        token <- ZIO.serviceWith[AuthToken](_.token)
        _ <- log.info(s"Token: $token")
        books <- if (token == "hello")
          bookRepository.fetchBooksByTitle(args.title)
        else ZIO.fail(UserUnauthorized())
      } yield books
  }

  private def authenticatedAddBookMutation(bookRepository: BookRepository): MutationAddBookArgs => AuthTask[Book] = {
    args =>
      for {
        token <- ZIO.serviceWith[AuthToken](_.token)
        _ <- log.info(s"Token: $token")
        book <- if (token == "hello")
          bookRepository.addBook(args.title, args.author)
        else ZIO.fail(UserUnauthorized())
      } yield book
  }

  private def authenticatedUpdateBookMutation(bookRepository: BookRepository): MutationUpdateBookArgs => AuthTask[Book] = {
    args =>
      for {
        token <- ZIO.serviceWith[AuthToken](_.token)
        _ <- log.info(s"Token: $token")
        book <- if (token == "hello")
          bookRepository.updateBook(args.id, args.title, args.author)
        else ZIO.fail(UserUnauthorized())
      } yield book
  }

  private def authenticatedDeleteBookMutation(bookRepository: BookRepository): MutationDeleteBookArgs => AuthTask[Boolean] = {
    args =>
      for {
        token <- ZIO.serviceWith[AuthToken](_.token)
        _ <- log.info(s"Token: $token")
        result <- if (token == "hello")
          bookRepository.deleteBook(args.id)
        else ZIO.fail(UserUnauthorized())
      } yield result
  }

  def makeGraphQLApi(bookRepository: BookRepository): GraphQL[AuthToken] = {
    val query: Operations.Query = getGraphQuery(bookRepository)
    val mutation: Operations.Mutation = getGraphMutation(bookRepository)
    val api = graphQL(RootResolver(query, mutation)) @@
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
