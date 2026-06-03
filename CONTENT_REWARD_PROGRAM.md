# Content Reward Program

A comprehensive content marketing platform integrated into the digital marketplace where sellers can post reward opportunities and marketers can submit content for payment.

## Features

### For Sellers (Digital Product Owners)
- ✅ Create reward tasks with detailed requirements
- ✅ Set budgets, deadlines, and content type specifications
- ✅ Review and approve/reject content submissions
- ✅ Manage multiple reward campaigns
- ✅ Track submission statistics

### For Marketers (Content Creators)
- ✅ Browse available reward opportunities
- ✅ Filter by content type, budget, and deadline
- ✅ Submit content with media attachments
- ✅ Track submission status and feedback
- ✅ Build portfolio and earn money

### For Admins
- ✅ Process payouts to marketers via Stripe
- ✅ Monitor payout status and analytics
- ✅ Manage the entire reward ecosystem
- ✅ View comprehensive statistics

## Database Schema

### Core Models

#### User
- Extended to support multiple roles (USER, ADMIN, SELLER, MARKETER)
- Relations to Seller and Marketer profiles

#### Marketer
- User profile for content creators
- Bio, specialties, portfolio, social links
- Rating, earnings, and completion stats
- Stripe Connect integration for payouts

#### RewardTask
- Task details: title, description, requirements
- Budget, deadline, content type
- Submission limits and status tracking
- Seller relationship

#### ContentSubmission
- Content submitted by marketers
- Media URLs, notes, feedback
- Status tracking (PENDING, APPROVED, REJECTED)
- Relationships to task and marketer

#### Payout
- Payment processing records
- Stripe payout integration
- Status tracking and admin processing
- Complete audit trail

## API Endpoints

### Rewards
- `GET /api/rewards` - List all reward tasks with filtering
- `POST /api/rewards` - Create new reward task (Sellers only)
- `GET /api/rewards/[id]` - Get specific task details
- `PUT /api/rewards/[id]` - Update task (Seller only)
- `DELETE /api/rewards/[id]` - Delete task (Seller only)

### Submissions
- `GET /api/submissions` - List submissions (role-based filtering)
- `POST /api/submissions` - Submit content (Marketers only)
- `GET /api/submissions/[id]` - Get submission details
- `PUT /api/submissions/[id]` - Review submission (Seller only)

### Marketers
- `GET /api/marketers` - List marketers with filtering
- `POST /api/marketers` - Register as marketer

### Payouts
- `GET /api/payouts` - List payouts (Admin only)
- `POST /api/payouts` - Process payout (Admin only)

## Frontend Pages

### Public Pages
- `/rewards` - Browse reward opportunities
- `/rewards/[id]` - View task details and submit content
- `/become-marketer` - Register as a content creator

### Seller Pages
- `/seller/rewards` - Manage reward tasks
- `/seller/rewards/[id]` - View task submissions and review

### Admin Pages
- `/admin/payouts` - Process payouts and view analytics

## Payment Integration

### Stripe Integration
- Automatic payout processing via Stripe Transfers
- Support for Stripe Connect accounts
- Complete payment audit trail
- Error handling and retry mechanisms

### Payout Flow
1. Seller approves content submission
2. Admin processes payout via admin panel
3. System creates Stripe transfer to marketer's account
4. Payment status updated in database
5. Marketer stats updated (earnings, completed tasks)

## Setup Instructions

### 1. Environment Variables
Add the following to your `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"

# Database (already configured)
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```

### 2. Database Migration
Run the migration to create the new tables:

```bash
npx prisma migrate dev --name add_content_reward_program
```

### 3. Install Dependencies
The required packages are already installed:

```bash
npm install stripe @stripe/stripe-js
```

### 4. Stripe Setup
1. Create a Stripe account
2. Get your API keys from the Stripe dashboard
3. Set up Stripe Connect for payouts to creators
4. Configure webhook endpoints (optional for advanced features)

## Usage Workflow

### For Sellers
1. **Create Reward Task**
   - Navigate to `/seller/rewards`
   - Click "Create New Task"
   - Fill in task details, budget, and requirements
   - Set deadline and submission limits

2. **Review Submissions**
   - View submissions in task details
   - Approve or reject with feedback
   - Monitor task performance

### For Marketers
1. **Register as Creator**
   - Visit `/become-marketer`
   - Create profile with specialties
   - Add portfolio and social links

2. **Browse and Submit**
   - Explore opportunities at `/rewards`
   - Filter by content type and budget
   - Submit content with media attachments
   - Track submission status

### For Admins
1. **Process Payouts**
   - Access `/admin/payouts`
   - Review pending payouts
   - Process payments via Stripe
   - Monitor payout analytics

## Security Features

- Role-based access control
- Session-based authentication
- Input validation and sanitization
- Secure payment processing
- Audit trails for all transactions

## Future Enhancements

### Planned Features
- [ ] Automated payout processing
- [ ] Advanced analytics and reporting
- [ ] Creator leaderboards
- [ ] Automated content approval
- [ ] Bulk payout processing
- [ ] Email notifications
- [ ] Mobile app support
- [ ] Advanced filtering and search
- [ ] Creator verification system
- [ ] Dispute resolution system

### Technical Improvements
- [ ] Real-time notifications
- [ ] File upload system
- [ ] Advanced search with Elasticsearch
- [ ] Caching layer
- [ ] API rate limiting
- [ ] Webhook integrations
- [ ] Multi-language support

## Troubleshooting

### Common Issues

1. **Payout Processing Fails**
   - Check Stripe API keys
   - Verify marketer has connected Stripe account
   - Check Stripe account status

2. **Database Errors**
   - Run `npx prisma generate` to update client
   - Check database connection
   - Verify migration status

3. **Authentication Issues**
   - Check NextAuth configuration
   - Verify session handling
   - Check role assignments

### Support
For technical support or feature requests, please refer to the main project documentation or create an issue in the repository.

## License
This Content Reward Program is part of the digital marketplace project and follows the same licensing terms.
