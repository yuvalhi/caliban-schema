package example

import caliban.GraphQL
import caliban.GraphQL.graphQL
import caliban.RootResolver
import caliban.schema.GenericSchema
import example.Types.{Book, MutationAddBookArgs, MutationDeleteBookArgs, MutationUpdateBookArgs, QueryBookByIdArgs, QueryBooksByAuthorArgs, QueryBooksByTitleArgs}
import zio.{Ref, Task, ZIO}
import zio.test.Assertion._
import zio.test._

object BookRepoApiSpec extends DefaultRunnableSpec {

  object TestSchema extends GenericSchema[AuthToken]

  import TestSchema.auto._

  val book1 = Book(1, "The Great Gatsby", ZIO.succeed("F. Scott Fitzgerald"))
  val book2 = Book(2, "1984", ZIO.succeed("George Orwell"))
  val book3 = Book(3, "Moby-Dick", ZIO.succeed("Herman Melville"))

  val booksRef: Ref[List[Book]] = Ref.make(List(book1, book2, book3)).unsafeRunSync()

  val bookRepository: BookRepository = new BookRepository {
    override def fetchBooks(title: Option[String]): Task[List[Book]] = booksRef.get.map(_.filter(_.title.contains(title.getOrElse(""))))
    override def fetchBookById(id: Int): Task[Book] = booksRef.get.map(_.find(_.id == id).get)
    override def fetchBooksByAuthor(author: String): Task[List[Book]] = booksRef.get.map(_.filter(_.author == author))
    override def fetchBooksByTitle(title: String): Task[List[Book]] = booksRef.get.map(_.filter(_.title.contains(title)))
    override def addBook(title: String, author: String): Task[Book] = booksRef.modify(books => {
      val newBook = Book(books.size + 1, title, ZIO.succeed(author))
      (newBook, books :+ newBook)
    })
    override def updateBook(id: Int, title: Option[String], author: Option[String]): Task[Book] = booksRef.modify(books => {
      val updatedBook = books.find(_.id == id).map(book => book.copy(
        title = title.getOrElse(book.title),
        author = author.getOrElse(book.author)
      )).get
      (updatedBook, books.map(b => if (b.id == id) updatedBook else b))
    })
    override def deleteBook(id: Int): Task[Boolean] = booksRef.modify(books => (books.exists(_.id == id), books.filterNot(_.id == id)))
  }

  val api: GraphQL[AuthToken] = BookRepoApi.makeGraphQLApi(bookRepository)

  def spec = suite("BookRepoApiSpec")(
    testM("fetch book by id") {
      val query = """query { bookById(id: 1) { id title author } }"""
      val expected = """{"data":{"bookById":{"id":1,"title":"The Great Gatsby","author":"F. Scott Fitzgerald"}}}"""
      assertM(api.interpreter.flatMap(_.execute(query)).map(_.data.toString))(equalTo(expected))
    },
    testM("fetch books by author") {
      val query = """query { booksByAuthor(author: "George Orwell") { id title author } }"""
      val expected = """{"data":{"booksByAuthor":[{"id":2,"title":"1984","author":"George Orwell"}]}}"""
      assertM(api.interpreter.flatMap(_.execute(query)).map(_.data.toString))(equalTo(expected))
    },
    testM("fetch books by title") {
      val query = """query { booksByTitle(title: "Moby-Dick") { id title author } }"""
      val expected = """{"data":{"booksByTitle":[{"id":3,"title":"Moby-Dick","author":"Herman Melville"}]}}"""
      assertM(api.interpreter.flatMap(_.execute(query)).map(_.data.toString))(equalTo(expected))
    },
    testM("add book") {
      val mutation = """mutation { addBook(title: "New Book", author: "New Author") { id title author } }"""
      val expected = """{"data":{"addBook":{"id":4,"title":"New Book","author":"New Author"}}}"""
      assertM(api.interpreter.flatMap(_.execute(mutation)).map(_.data.toString))(equalTo(expected))
    },
    testM("update book") {
      val mutation = """mutation { updateBook(id: 1, title: "Updated Title", author: "Updated Author") { id title author } }"""
      val expected = """{"data":{"updateBook":{"id":1,"title":"Updated Title","author":"Updated Author"}}}"""
      assertM(api.interpreter.flatMap(_.execute(mutation)).map(_.data.toString))(equalTo(expected))
    },
    testM("delete book") {
      val mutation = """mutation { deleteBook(id: 1) }"""
      val expected = """{"data":{"deleteBook":true}}"""
      assertM(api.interpreter.flatMap(_.execute(mutation)).map(_.data.toString))(equalTo(expected))
    }
  )
}
