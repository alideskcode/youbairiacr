import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createTestSeller() {
  try {
    // Create a test user
    const hashedPassword = await bcrypt.hash('seller123', 12)
    
    const user = await prisma.user.create({
      data: {
        name: 'Test Seller',
        email: 'seller@example.com',
        password: hashedPassword,
        role: 'USER'
      }
    })

    console.log('Test user created:', user)

    // Create a seller profile for this user
    const seller = await prisma.seller.create({
      data: {
        userId: user.id,
        shopName: 'Test Digital Shop',
        shopUrl: 'test-digital-shop',
        description: 'A test shop for demonstrating the marketplace functionality',
        category: 'templates',
        contactEmail: 'seller@example.com',
        website: 'https://example.com',
        socialLinks: {
          twitter: 'https://twitter.com/testseller',
          facebook: 'https://facebook.com/testseller',
          instagram: 'https://instagram.com/testseller'
        },
        status: 'PENDING'
      }
    })

    console.log('Test seller created:', seller)

    // Create a test product
    const product = await prisma.product.create({
      data: {
        title: 'Test Digital Product',
        description: 'This is a test digital product for demonstration purposes',
        shortDescription: 'A demo digital product to showcase marketplace flow.',
        longDescription: 'This sample product demonstrates how generated product descriptions and images will appear in the Youbairia marketplace.',
        price: 29.99,
        category: 'templates',
        tags: ['demo', 'template', 'test'],
        image: '/placeholder.jpg',
        sellerId: seller.id,
        status: 'PENDING'
      }
    })

    console.log('Test product created:', product)

    console.log('\n✅ Test data created successfully!')
    console.log('📧 Test Seller Login: seller@example.com / seller123')
    console.log('🔗 Shop URL: /shop/test-digital-shop')
    console.log('👑 Admin can now approve/reject this seller and product')

  } catch (error) {
    console.error('Error creating test seller:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestSeller() 