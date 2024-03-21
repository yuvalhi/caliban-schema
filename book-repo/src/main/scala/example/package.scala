import zio.RIO

package object example {

  type AuthTask[A] = RIO[AuthToken, A]



}
