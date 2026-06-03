import type { NextApiRequest, NextApiResponse } from 'next'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    // Connect to your MySQL database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',           // change if different
      password: '',           // your MySQL password
      database: 'youbairia_auth', // change to your DB name
    })

    // Fetch user by email
    const [rows]: any = await connection.execute(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    )

    await connection.end()

    const user = rows[0]

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Compare hashed password (make sure passwords are hashed in DB)
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Auth successful – return user info (don't return password)
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })

  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Server error. Please try again.' })
  }
}
