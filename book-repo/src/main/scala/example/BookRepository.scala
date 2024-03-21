package example

import example.Types.Book
import zio.{Task, ZIO, ZLayer, durationInt}

import scala.language.postfixOps

trait BookRepository {
  def fetchBooks(title: Option[String]): Task[List[Book]]
}

object BookRepository {
  def layer: ZLayer[Any, Throwable, BookRepository] = ZLayer.succeed(BookRepositoryLive())
}

case class BookRepositoryLive() extends BookRepository {
  private val books = List(
    Book(1, "The Great Gatsby", ZIO.succeed("F. Scott Fitzgerald").delay(1 seconds)),
    Book(2, "1984", ZIO.succeed("George Orwell").delay(5 seconds)),
    Book(3, "Moby-Dick", ZIO.succeed("Herman Melville").delay(1 seconds))
  )

  override def fetchBooks(title: Option[String]): Task[List[Book]] = {
    val result = title match {
      case Some(filterTitle) => books.filter(_.title.contains(filterTitle))
      case None => books
    }
    if (result.nonEmpty)
      ZIO.succeed(result)
    else ZIO.fail(BookNotFound(s"could not find book $title"))
  }

}

