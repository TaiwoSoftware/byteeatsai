export const About = () => {
  return (
    <div className="min-h-screen bg-white px-6 md:px-16 py-14">

  {/* Hero Section */}
  <div className="max-w-5xl mx-auto text-center mb-20">
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
      About Our Platform
    </h1>

    <div className="w-20 h-1 bg-orange-700 mx-auto mt-4 rounded-full"></div>

    <p className="mt-6 text-gray-600 text-lg leading-relaxed">
      We’re building a smart, modern food-ordering platform powered by
      Artificial Intelligence and Blockchain — designed to make ordering
      faster, safer, and more intuitive for everyone.
    </p>
  </div>

  {/* Mission + Vision */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-24">

    <div className="border rounded-2xl p-8 hover:shadow-md transition">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        🎯 Our Mission
      </h2>
      <p className="text-gray-600 leading-relaxed">
        To simplify food ordering by combining smart automation,
        conversational AI, and secure blockchain technology — delivering
        a seamless experience from discovery to payment.
      </p>
    </div>

    <div className="border rounded-2xl p-8 hover:shadow-md transition">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        🔭 Our Vision
      </h2>
      <p className="text-gray-600 leading-relaxed">
        We envision a future where users can place orders, make payments,
        and track deliveries effortlessly using natural conversations,
        while blockchain ensures transparency and trust behind the scenes.
      </p>
    </div>

  </div>

  {/* What Makes Us Different */}
  <div className="max-w-6xl mx-auto mb-24">
    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
      What Makes Us Different
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

      <div className="p-6 border rounded-xl hover:shadow-md transition">
        <div className="w-12 h-12 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center mb-4">
          🤖
        </div>
        <h3 className="font-semibold text-lg text-gray-900">
          AI-Powered Experience
        </h3>
        <p className="text-gray-600 mt-2 text-sm">
          Our AI assistant helps users find meals, ask questions, and soon
          place orders — all through natural conversations.
        </p>
      </div>

      <div className="p-6 border rounded-xl hover:shadow-md transition">
        <div className="w-12 h-12 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center mb-4">
          🔐
        </div>
        <h3 className="font-semibold text-lg text-gray-900">
          Blockchain Security
        </h3>
        <p className="text-gray-600 mt-2 text-sm">
          Payments and order records are secured using blockchain,
          ensuring transparency, trust, and data integrity.
        </p>
      </div>

      <div className="p-6 border rounded-xl hover:shadow-md transition">
        <div className="w-12 h-12 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center mb-4">
          ⚡
        </div>
        <h3 className="font-semibold text-lg text-gray-900">
          Built for Speed
        </h3>
        <p className="text-gray-600 mt-2 text-sm">
          Optimized for performance across all devices — fast loading,
          responsive, and user-friendly.
        </p>
      </div>

    </div>
  </div>

  {/* Future Focus */}
  <div className="max-w-5xl mx-auto text-center mb-24">
    <h2 className="text-3xl font-bold text-gray-900">
      Built for the Future
    </h2>
    <p className="mt-4 text-gray-600 leading-relaxed">
      This project is continuously evolving. Upcoming features include
      AI-powered cart actions, voice-based ordering, blockchain loyalty
      rewards, smart contracts for vendors, and seamless Web3 payments —
      all designed to push food ordering into the next generation.
    </p>
  </div>

  {/* Call to Action */}
  <div className="max-w-4xl mx-auto text-center border rounded-2xl p-10 bg-gray-50">
    <h3 className="text-2xl font-semibold text-gray-900">
      Join Us on This Journey
    </h3>
    <p className="text-gray-600 mt-3">
      We’re building more than just an app — we’re creating a smarter,
      safer, and more connected way to order food.
    </p>

    <button className="mt-6 px-6 py-3 bg-orange-700 text-white rounded-lg hover:bg-orange-800 transition">
      Explore the Platform
    </button>
  </div>

</div>

  )
}
