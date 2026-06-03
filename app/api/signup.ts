import type { NextApiRequest, NextApiResponse } from 'next'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'youbairia_auth',
    })

    // Check if user already exists
    const [existing]: any = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    )

    if (existing.length > 0) {
      await connection.end()
      return res.status(409).json({ message: 'Email already in use' })
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user
    await connection.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    )

    await connection.end()

    return res.status(201).json({ message: 'User registered successfully' })

  } catch (error) {
    console.error('Signup error:', error)
    return res.status(500).json({ message: 'Server error. Please try again.' })
  }
}
