import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pay Per Million | Earn From Views | Youbairia",
  description:
    "Discover Pay Per Million by Youbairia. Earn rewards from content views and help brands grow through performance-based campaigns.",
};

export default function PayPerMillionPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <span className="inline-block px-4 py-2 rounded-full bg-gray-100 text-sm font-medium">
          Youbairia Original Model
        </span>

        <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight">
          Pay Per Million™
        </h1>

        <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600">
          A new way for creators to earn and brands to grow.
          Get rewarded based on the performance your content generates.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/signup"
            className="px-6 py-3 bg-black text-white rounded-xl"
          >
            Start Earning
          </a>

          <a
            href="/"
            className="px-6 py-3 border rounded-xl"
          >
            View Campaigns
          </a>
        </div>
      </section>

      {/* Explanation */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold">
            What Is Pay Per Million?
          </h2>

          <p className="mt-6 text-lg text-gray-600">
            Instead of fixed sponsorships, creators earn rewards
            based on actual content performance.
          </p>

          <p className="mt-4 text-lg text-gray-600">
            Brands define rewards and creators are paid
            according to the views their content generates.
          </p>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">
          How It Works
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              title: "Join Campaign",
              desc: "Browse and join active brand campaigns."
            },
            {
              title: "Create Content",
              desc: "Post videos using campaign guidelines."
            },
            {
              title: "Get Views",
              desc: "Your content reaches new audiences."
            },
            {
              title: "Earn Rewards",
              desc: "Receive payouts based on performance."
            }
          ].map((step) => (
            <div
              key={step.title}
              className="border rounded-2xl p-6"
            >
              <h3 className="font-semibold text-xl">
                {step.title}
              </h3>

              <p className="mt-3 text-gray-600">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Examples */}
      <section className="bg-black text-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center">
            Example Earnings
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="border border-white/20 rounded-2xl p-8 text-center">
              <p className="text-gray-400">100K Views</p>
              <h3 className="text-4xl font-bold mt-2">₹500</h3>
            </div>

            <div className="border border-white/20 rounded-2xl p-8 text-center">
              <p className="text-gray-400">500K Views</p>
              <h3 className="text-4xl font-bold mt-2">₹2,500</h3>
            </div>

            <div className="border border-white/20 rounded-2xl p-8 text-center">
              <p className="text-gray-400">1M Views</p>
              <h3 className="text-4xl font-bold mt-2">₹5,000</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-12">
          Why Creators Love It
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="border rounded-2xl p-8">
            <h3 className="text-2xl font-semibold">
              Unlimited Potential
            </h3>
            <p className="mt-4 text-gray-600">
              Viral content can generate significantly
              higher rewards.
            </p>
          </div>

          <div className="border rounded-2xl p-8">
            <h3 className="text-2xl font-semibold">
              No Follower Requirement
            </h3>
            <p className="mt-4 text-gray-600">
              Great content matters more than audience size.
            </p>
          </div>

          <div className="border rounded-2xl p-8">
            <h3 className="text-2xl font-semibold">
              Transparent Rewards
            </h3>
            <p className="mt-4 text-gray-600">
              Know exactly how much each milestone pays.
            </p>
          </div>

          <div className="border rounded-2xl p-8">
            <h3 className="text-2xl font-semibold">
              Real Opportunities
            </h3>
            <p className="mt-4 text-gray-600">
              Work with startups, brands, apps, and creators.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold">
            Start Earning With Pay Per Million
          </h2>

          <p className="mt-6 text-lg text-gray-600">
            Join campaigns, create content, and get rewarded
            for the impact you make.
          </p>

          <a
            href="/signup"
            className="inline-block mt-8 px-8 py-4 bg-black text-white rounded-xl"
          >
            Join Youbairia
          </a>
        </div>
      </section>
    </main>
  );
}