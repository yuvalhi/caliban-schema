package example

trait AuthToken {
  def token: String
}

object AuthToken {
  def apply(authToken: String): AuthToken = new AuthToken {
    override def token: String = authToken
  }
}



