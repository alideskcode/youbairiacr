import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Rewards Platform | Get Paid for Views | Youbairia",
  description:
    "Join content reward campaigns, create videos, earn based on views, and connect with brands through Youbairia's Pay Per Million platform.",
};

export default function ContentRewardsPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero */}
      <section className="px-6 py-24 text-center max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Get Paid for Creating Content
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Turn videos, clips, and social media posts into income.
          Join campaigns from brands, create content, get views,
          and earn rewards based on performance.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/signup"
            className="px-6 py-3 rounded-xl bg-black text-white font-medium"
          >
            Start Earning
          </a>

          <a
            href="/signup"
            className="px-6 py-3 rounded-xl border border-black font-medium"
          >
            Launch a Campaign
          </a>
        </div>
      </section>

      {/* Intro */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold">
            Trusted by Creators and Brands
          </h2>

          <p className="mt-4 text-gray-600">
            Whether you're a creator looking to earn or a brand looking
            to grow, Youbairia connects both sides through
            performance-based content rewards.
          </p>
        </div>
      </section>

      {/* How it Works */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="border rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-6">
              For Creators
            </h3>

            <ol className="space-y-4 text-gray-700">
              <li>1. Join a campaign</li>
              <li>2. Get content and guidelines</li>
              <li>3. Post on social platforms</li>
              <li>4. Submit your content</li>
              <li>5. Earn rewards based on views</li>
            </ol>
          </div>

          <div className="border rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-6">
              For Brands
            </h3>

            <ol className="space-y-4 text-gray-700">
              <li>1. Create a campaign</li>
              <li>2. Set reward rates</li>
              <li>3. Upload content assets</li>
              <li>4. Receive creator submissions</li>
              <li>5. Pay only for results</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Content Rewards */}
      <section className="px-6 py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold">
            What Are Content Rewards?
          </h2>

          <p className="mt-6 text-lg text-gray-600">
            Content Rewards allow creators to earn money by promoting
            brands through videos and social content.
          </p>

          <p className="mt-4 text-lg text-gray-600">
            Instead of paying influencers upfront, brands reward
            creators based on actual performance and engagement.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Why Use Youbairia?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "Performance Based",
            "Open to Everyone",
            "Transparent Tracking",
            "Fast Payouts",
            "Multiple Platforms",
            "Scalable Campaigns",
          ].map((feature) => (
            <div
              key={feature}
              className="border rounded-2xl p-6"
            >
              <h3 className="font-semibold text-lg">
                {feature}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Pay Per Million */}
      <section className="px-6 py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold">
            Pay Per Million™
          </h2>

          <p className="mt-6 text-lg text-gray-300">
            Brands set rewards based on content performance,
            allowing creators to know exactly what they can earn.
          </p>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="border border-white/20 rounded-xl p-6">
              <p className="text-sm text-gray-400">
                100,000 Views
              </p>
              <p className="text-2xl font-bold">
                ₹500
              </p>
            </div>

            <div className="border border-white/20 rounded-xl p-6">
              <p className="text-sm text-gray-400">
                500,000 Views
              </p>
              <p className="text-2xl font-bold">
                ₹2,500
              </p>
            </div>

            <div className="border border-white/20 rounded-xl p-6">
              <p className="text-sm text-gray-400">
                1,000,000 Views
              </p>
              <p className="text-2xl font-bold">
                ₹5,000
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Who Is It For?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            "Creators",
            "Video Editors",
            "UGC Creators",
            "Brands",
            "Startups",
          ].map((item) => (
            <div
              key={item}
              className="border rounded-2xl p-6 text-center"
            >
              <p className="font-medium">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-xl">
                Do I need followers?
              </h3>
              <p className="text-gray-600 mt-2">
                No. Great content can earn rewards regardless
                of follower count.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-xl">
                How do I get paid?
              </h3>
              <p className="text-gray-600 mt-2">
                Rewards are distributed after campaign
                verification and approval.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-xl">
                What platforms are supported?
              </h3>
              <p className="text-gray-600 mt-2">
                Instagram, YouTube Shorts, TikTok, and
                other supported platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-5xl font-bold">
          Start Earning From Content Today
        </h2>

        <p className="mt-6 text-gray-600 text-lg">
          Join creators and brands building the future of
          performance-based marketing.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/signup"
            className="px-6 py-3 rounded-xl bg-black text-white font-medium"
          >
            Join as Creator
          </a>

          <a
            href="/signup"
            className="px-6 py-3 rounded-xl border border-black font-medium"
          >
            Launch a Campaign
          </a>
        </div>
      </section>
    </main>
  );
}