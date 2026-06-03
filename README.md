# Digital Marketplace - Content Reward Program

A comprehensive digital marketplace with an integrated Content Reward Program that connects sellers with content creators for marketing campaigns.

## 🚀 Features

### Content Reward Program
- **Seller Dashboard**: Create and manage reward tasks
- **Marketer Portal**: Browse opportunities and submit content
- **Admin Panel**: Process payouts and manage campaigns
- **Paytm UPI Integration**: Seamless payment processing in INR
- **Real-time Analytics**: Track campaign performance and earnings

### Core Marketplace
- Product listings and management
- User authentication and role-based access
- Shopping cart and checkout system
- Seller shop creation and management

## 💳 Payment Integration

### Paytm UPI Configuration
The system is configured to receive payments at: **`9368598307@paytm`**

#### To Change Your Paytm UPI ID:

1. **Via Configuration File:**
   ```typescript
   // lib/payment-config.ts
   export const PAYMENT_CONFIG = {
     PAYTM_UPI: {
       UPI_ID: 'your-new-upi-id@paytm', // Change this
       MERCHANT_NAME: 'Digital Marketplace',
       CURRENCY: 'INR',
     },
   };
   ```

2. **Via Admin Interface:**
   - Login as admin: `admin@example.com` / `password123`
   - Navigate to: http://localhost:3001/admin/payment-settings
   - Update your Paytm UPI ID in the settings form

3. **Via Database:**
   ```sql
   -- Update the UPI ID in the payment configuration
   UPDATE payouts SET upiId = 'your-new-upi-id@paytm' WHERE paymentMethod = 'PAYTM_UPI';
   ```

#### Payment Flow:
1. **Content Approval**: Seller approves marketer's content submission
2. **Admin Processing**: Admin processes payout via Paytm UPI
3. **Payment Transfer**: Payment sent to your configured Paytm UPI ID
4. **Confirmation**: System updates payout status and marketer earnings

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, ShadCN UI
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Paytm UPI Integration
- **Deployment**: Vercel-ready

## 📊 Database Schema

### Core Models
- `User`: Authentication and role management
- `Seller`: Seller profiles and shop information
- `Marketer`: Content creator profiles and specialties
- `RewardTask`: Marketing tasks and requirements
- `ContentSubmission`: Submitted content and reviews
- `Payout`: Payment processing and tracking

### Payment Fields
```sql
-- Payout table includes Paytm UPI support
CREATE TABLE payouts (
  id VARCHAR(191) PRIMARY KEY,
  submissionId VARCHAR(191) UNIQUE,
  marketerId VARCHAR(191),
  userId VARCHAR(191),
  amount DECIMAL(10,2),
  stripePayoutId VARCHAR(191), -- Also used for Paytm ID
  upiId VARCHAR(191), -- Paytm UPI ID
  paymentMethod VARCHAR(191) DEFAULT 'PAYTM_UPI',
  status VARCHAR(191) DEFAULT 'PENDING',
  processedAt DATETIME(3),
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
);
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL database
- XAMPP (for local development)

### Installation

1. **Clone and Install:**
   ```bash
   git clone <repository>
   cd digital-marketplace
   npm install
   ```

2. **Database Setup:**
   ```bash
   # Configure your database connection
   cp .env.example .env
   
   # Run migrations
   npx prisma migrate dev
   
   # Generate Prisma client
   npx prisma generate
   ```

3. **Setup Sample Data:**
   ```bash
   # Create sample users and tasks
   npx tsx scripts/setup-content-rewards.ts
   ```

4. **Start Development:**
   ```bash
   npm run dev
   ```

### Default Login Credentials
- **Seller**: `seller@example.com` / `password123`
- **Marketer**: `marketer@example.com` / `password123`
- **Admin**: `admin@example.com` / `password123`

## 📱 Usage Guide

### For Sellers
1. Login with seller credentials
2. Navigate to `/seller/rewards`
3. Create new reward tasks with budgets and requirements
4. Review and approve content submissions
5. Monitor campaign performance

### For Marketers
1. Register as a marketer at `/become-marketer`
2. Browse opportunities at `/rewards`
3. Submit content for approved tasks
4. Track earnings and completed tasks

### For Adminsm
1. Login with admin credentials
2. Process payouts at `/admin/payouts`
3. Manage payment settings at `/admin/payment-settings`
4. Monitor platform analytics

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/database"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3001"

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-public-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# OpenRouter / Image Generation
OPENROUTER_API_KEY="your-openrouter-api-key"
OPENROUTER_CHAT_MODEL="openai/gpt-4o-mini"
OPENROUTER_IMAGE_MODEL="gpt-image-1"
IMAGE_PROVIDER="openrouter"

# Paytm UPI (Optional - can be set via admin interface)
PAYTM_UPI_ID="9368598307@paytm"
```

Create a Supabase storage bucket named `product-images` for generated product thumbnails.

### Payment Configuration
```typescript
// lib/payment-config.ts
export const PAYMENT_CONFIG = {
  PAYTM_UPI: {
    UPI_ID: '9368598307@paytm', // Your Paytm UPI ID
    MERCHANT_NAME: 'Digital Marketplace',
    CURRENCY: 'INR',
  },
  DEFAULT_PAYMENT_METHOD: 'PAYTM_UPI',
};
```

## 🔌 API Endpoints

### Content Rewards
- `GET /api/rewards` - List reward tasks
- `POST /api/rewards` - Create new task
- `PUT /api/rewards/[id]` - Update task
- `DELETE /api/rewards/[id]` - Delete task

### Submissions
- `GET /api/submissions` - List content submissions
- `POST /api/submissions` - Submit content
- `PUT /api/submissions/[id]` - Review submission

### Payouts
- `GET /api/payouts` - List payouts (Admin)
- `POST /api/payouts` - Process payout (Admin)

### Marketers
- `GET /api/marketers` - List marketers
- `POST /api/marketers` - Register as marketer

## 🎯 Key Features

### Content Types Supported
- **UGC**: User-generated content
- **REEL**: Short-form video content
- **TWEET**: Social media posts
- **BLOG_POST**: Long-form written content
- **VIDEO**: YouTube videos and tutorials

### Payment Processing
- **Paytm UPI Integration**: Direct bank transfers
- **Real-time Processing**: Instant payment confirmation
- **Transaction Tracking**: Complete payment history
- **Multi-currency Support**: INR (Indian Rupees)

### Analytics & Reporting
- Campaign performance metrics
- Creator earnings tracking
- Payment processing statistics
- Platform usage analytics

## 🔒 Security Features

- Role-based access control
- Secure authentication with NextAuth.js
- Input validation and sanitization
- SQL injection prevention with Prisma
- XSS protection with React

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Environment Setup
```bash
# Production environment variables
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
```

## 🔄 Future Enhancements

### Planned Features
- **Automated Payouts**: Scheduled payment processing
- **Leaderboards**: Top creators and campaigns
- **Advanced Analytics**: Detailed performance insights
- **Multi-payment Support**: Additional payment gateways
- **Mobile App**: Native mobile application
- **AI Content Review**: Automated content moderation

### Integration Opportunities
- **Paytm API**: Real-time payment processing
- **Social Media APIs**: Direct content publishing
- **Analytics Tools**: Advanced reporting
- **Email Marketing**: Automated notifications

## 📞 Support

For technical support or questions:
- **Email**: hello@youbairia.com
- **Documentation**: Check the `/docs` folder
- **Issues**: Create GitHub issues for bugs

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for the digital creator economy** 