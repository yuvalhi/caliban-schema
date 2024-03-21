package example

case class MissingToken() extends Throwable

case class UserUnauthorized() extends Throwable

case class BookNotFound(message: String) extends Throwable