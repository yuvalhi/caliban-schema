package example

import example.Types.Book
import zio.{Task, ZIO, ZLayer, durationInt, Ref}

import scala.language.postfixOps

trait BookRepository {
  def fetchBooks(title: Option[String]): Task[List[Book]]
  def fetchBookById(id: Int): Task[Book]
  def fetchBooksByAuthor(author: String): Task[List[Book]]
  def fetchBooksByTitle(title: String): Task[List[Book]]
  def addBook(title: String, author: String): Task[Book]
  def updateBook(id: Int, title: Option[String], author: Option[String]): Task[Book]
  def deleteBook(id: Int): Task[Boolean]
}

object BookRepository {
  def layer: ZLayer[Any, Throwable, BookRepository] = ZLayer.succeed(BookRepositoryLive())
}

case class BookRepositoryLive() extends BookRepository {
  private val booksRef = Ref.make(List(
    Book(1, "The Great Gatsby", ZIO.succeed("F. Scott Fitzgerald").delay(1 seconds)),
    Book(2, "1984", ZIO.succeed("George Orwell").delay(5 seconds)),
    Book(3, "Moby-Dick", ZIO.succeed("Herman Melville").delay(1 seconds))
  ))

  override def fetchBooks(title: Option[String]): Task[List[Book]] = {
    for {
      books <- booksRef.get
      result = title match {
        case Some(filterTitle) => books.filter(_.title.contains(filterTitle))
        case None => books
      }
      res <- if (result.nonEmpty)
        ZIO.succeed(result)
      else ZIO.fail(BookNotFound(s"could not find book $title"))
    } yield res
  }

  override def fetchBookById(id: Int): Task[Book] = {
    for {
      books <- booksRef.get
      book <- books.find(_.id == id) match {
        case Some(book) => ZIO.succeed(book)
        case None => ZIO.fail(BookNotFound(s"could not find book with id $id"))
      }
    } yield book
  }

  override def fetchBooksByAuthor(author: String): Task[List[Book]] = {
    for {
      books <- booksRef.get
      result = books.filter(_.author == author)
      res <- if (result.nonEmpty)
        ZIO.succeed(result)
      else ZIO.fail(BookNotFound(s"could not find books by author $author"))
    } yield res
  }

  override def fetchBooksByTitle(title: String): Task[List[Book]] = {
    for {
      books <- booksRef.get
      result = books.filter(_.title.contains(title))
      res <- if (result.nonEmpty)
        ZIO.succeed(result)
      else ZIO.fail(BookNotFound(s"could not find books with title $title"))
    } yield res
  }

  override def addBook(title: String, author: String): Task[Book] = {
    for {
      books <- booksRef.get
      newBook = Book(books.size + 1, title, ZIO.succeed(author))
      _ <- booksRef.set(books :+ newBook)
    } yield newBook
  }

  override def updateBook(id: Int, title: Option[String], author: Option[String]): Task[Book] = {
    for {
      books <- booksRef.get
      updatedBook <- books.find(_.id == id) match {
        case Some(book) =>
          val updatedBook = book.copy(
            title = title.getOrElse(book.title),
            author = author.getOrElse(book.author)
          )
          booksRef.set(books.map(b => if (b.id == id) updatedBook else b)) *> ZIO.succeed(updatedBook)
        case None => ZIO.fail(BookNotFound(s"could not find book with id $id"))
      }
    } yield updatedBook
  }

  override def deleteBook(id: Int): Task[Boolean] = {
    for {
      books <- booksRef.get
      initialSize = books.size
      _ <- booksRef.set(books.filterNot(_.id == id))
    } yield books.size < initialSize
  }
}
