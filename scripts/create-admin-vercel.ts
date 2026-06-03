import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    console.log('✅ Admin user created successfully:', adminUser.email)
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser() 