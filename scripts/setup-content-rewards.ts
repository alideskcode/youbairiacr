import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function setupContentRewards() {
  try {
    console.log('🚀 Setting up Content Reward Program...\n');

    // 1. Create a seller user
    console.log('1. Creating seller account...');
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const sellerUser = await prisma.user.upsert({
      where: { email: 'seller@example.com' },
      update: {},
      create: {
        name: 'Digital Product Seller',
        email: 'seller@example.com',
        password: hashedPassword,
        role: 'SELLER',
      },
    });

    console.log('✅ Seller user created:', sellerUser.email);

    // 2. Create seller profile
    console.log('\n2. Creating seller profile...');
    
    const seller = await prisma.seller.upsert({
      where: { userId: sellerUser.id },
      update: {},
      create: {
        userId: sellerUser.id,
        shopName: 'Digital Creations Hub',
        shopUrl: 'digital-creations-hub',
        description: 'Premium digital products and creative assets',
        category: 'Digital Products',
        contactEmail: 'seller@example.com',
        website: 'https://digitalcreationshub.com',
        socialLinks: {
          instagram: '@digitalcreationshub',
          twitter: '@digicreations',
        },
        status: 'APPROVED',
      },
    });

    console.log('✅ Seller profile created:', seller.shopName);

    // 3. Create sample reward tasks
    console.log('\n3. Creating sample reward tasks...');

    const sampleTasks = [
      {
        title: 'Create Instagram Reel for Fitness App',
        description: 'We need engaging Instagram reels to promote our new fitness tracking app. Looking for authentic content that showcases the app features.',
        productDetails: 'FitTrack Pro - A comprehensive fitness tracking app with workout plans, nutrition tracking, and progress analytics.',
        contentType: 'REEL',
        requirements: '30-60 second Instagram reel, showcase app features, include call-to-action, use trending fitness hashtags',
        budget: 150,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        maxSubmissions: 5,
      },
      {
        title: 'Write Blog Post About Digital Marketing Trends',
        description: 'Need a comprehensive blog post about the latest digital marketing trends for 2024.',
        productDetails: 'MarketingMaster Pro - Digital marketing course and toolkit for entrepreneurs.',
        contentType: 'BLOG_POST',
        requirements: '1500-2000 words, include statistics and examples, SEO optimized, engaging headline',
        budget: 200,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        maxSubmissions: 3,
      },
      {
        title: 'Create UGC for E-commerce Store',
        description: 'Looking for authentic user-generated content to showcase our fashion products.',
        productDetails: 'StyleHub - Online fashion store with trendy clothing and accessories.',
        contentType: 'UGC',
        requirements: 'High-quality photos/videos, natural poses, include product details, lifestyle shots',
        budget: 100,
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        maxSubmissions: 8,
      },
      {
        title: 'Design Social Media Posts for Tech Startup',
        description: 'Need creative social media posts to promote our new SaaS platform.',
        productDetails: 'CloudFlow - Project management and team collaboration platform.',
        contentType: 'TWEET',
        requirements: '5 engaging tweets, include graphics, use tech hashtags, highlight key features',
        budget: 120,
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        maxSubmissions: 4,
      },
    ];

    for (const taskData of sampleTasks) {
      const task = await prisma.rewardTask.create({
        data: {
          ...taskData,
          sellerId: seller.id,
        },
      });
      console.log(`✅ Created task: ${task.title} ($${task.budget})`);
    }

    // 4. Create a marketer user
    console.log('\n4. Creating marketer account...');
    
    const marketerUser = await prisma.user.upsert({
      where: { email: 'marketer@example.com' },
      update: {},
      create: {
        name: 'Content Creator Pro',
        email: 'marketer@example.com',
        password: hashedPassword,
        role: 'MARKETER',
      },
    });

    console.log('✅ Marketer user created:', marketerUser.email);

    // 5. Create marketer profile
    console.log('\n5. Creating marketer profile...');
    
    const marketer = await prisma.marketer.upsert({
      where: { userId: marketerUser.id },
      update: {},
      create: {
        userId: marketerUser.id,
        bio: 'Experienced content creator specializing in social media marketing, video production, and brand storytelling.',
        specialties: ['UGC', 'REEL', 'VIDEO', 'BLOG_POST'],
        portfolio: 'https://contentcreatorpro.com',
        socialLinks: {
          instagram: '@contentcreatorpro',
          youtube: '@contentcreatorpro',
          linkedin: 'contentcreatorpro',
        },
        status: 'ACTIVE',
      },
    });

    console.log('✅ Marketer profile created:', marketerUser.name);

    // 6. Create admin user
    console.log('\n6. Creating admin account...');
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        name: 'Platform Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user created:', adminUser.email);

    console.log('\n🎉 Content Reward Program setup complete!');
    console.log('\n📋 Login Credentials:');
    console.log('Seller: seller@example.com / password123');
    console.log('Marketer: marketer@example.com / password123');
    console.log('Admin: admin@example.com / password123');
    
    console.log('\n🔗 Access URLs:');
    console.log('Browse Rewards: http://localhost:3001/rewards');
    console.log('Seller Dashboard: http://localhost:3001/seller/rewards');
    console.log('Admin Payouts: http://localhost:3001/admin/payouts');
    console.log('Become Marketer: http://localhost:3001/become-marketer');

    console.log('\n📝 Next Steps:');
    console.log('1. Login as seller to create more reward tasks');
    console.log('2. Login as marketer to browse and submit content');
    console.log('3. Login as admin to process payouts');
    console.log('4. Set up Stripe for payment processing');

  } catch (error) {
    console.error('❌ Error setting up Content Reward Program:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupContentRewards();
