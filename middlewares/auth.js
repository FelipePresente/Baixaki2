import jwt from 'jsonwebtoken'

const secret_key = process.env.SECRET_KEY

// It reades the userCookie to verify its role
export default async function roleVerification(req, res, actionCallback) {
  const token = req.cookies.userCookie

  if (token) {
    try {
      const decodedUser = jwt.verify(token, secret_key)

      if (decodedUser.role === "admin") {
        await actionCallback()
      } else {
        res.status(403).send("Access denied")
      }
    } catch (error) {
      res.status(400).send('Invalid Token!')
    }
  } else {
    res.redirect('/')
  }
}