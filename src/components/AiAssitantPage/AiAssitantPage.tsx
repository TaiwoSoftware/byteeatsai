
import aiAssistantImage from "../Images/byteeats.png";
const AiAssitantPage = () => {
  return (
    <div>
      <div className="mt-10 ">
        <h1 className="text-center text-orange-700 text-3xl font-extrabold">🤖 AI Assistant (Coming Alive)</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center p-6 md:p-12 bg-white rounded-2xl shadow-sm">

  {/* Text Section */}
  <div className="space-y-5">
    <h2 className="text-3xl font-bold text-gray-900">
      AI Assistant
    </h2>

    <div className="w-16 h-1 bg-orange-700 rounded-full"></div>

    <p className="text-gray-600 leading-relaxed">
      Our AI Assistant is built to make your experience faster, smarter, and stress-free.
      It acts as your digital guide — answering questions, offering instant support,
      and helping you navigate the platform effortlessly.
    </p>

    <p className="text-gray-600 leading-relaxed">
      Right now, it works like an intelligent FAQ, delivering clear and helpful responses
      in real time. But this is just the beginning.
    </p>

    {/* Current Features */}
    <div className="flex flex-wrap gap-2 pt-2">
      <span className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700">
        Instant Answers
      </span>
      <span className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700">
        Smart Guidance
      </span>
      <span className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700">
        24/7 Support
      </span>
    </div>

    {/* Upcoming Features */}
    <div className="pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        🚀 Upcoming AI Features
      </h3>

      <ul className="space-y-3 text-gray-600">
        <li className="flex gap-3">
          <span className="text-orange-700">•</span>
          <span>
            <strong>AI-Powered Food Ordering:</strong> Add meals to your cart just by chatting —
            “Add two burgers and a drink” and it’s done.
          </span>
        </li>

        <li className="flex gap-3">
          <span className="text-orange-700">•</span>
          <span>
            <strong>Smart Recommendations:</strong> Get food suggestions based on your taste,
            order history, and time of day.
          </span>
        </li>

        <li className="flex gap-3">
          <span className="text-orange-700">•</span>
          <span>
            <strong>Order Tracking via Chat:</strong> Ask the AI where your order is and get
            real-time updates instantly.
          </span>
        </li>

        <li className="flex gap-3">
          <span className="text-orange-700">•</span>
          <span>
            <strong>Personalized Experience:</strong> The assistant learns your preferences
            and responds more accurately over time.
          </span>
        </li>
      </ul>
    </div>
  </div>

  {/* Image Section */}
  <div className="flex justify-center md:justify-end">
    <div className="relative">
      <div className="absolute -inset-2 bg-orange-700/20 rounded-2xl blur-xl"></div>
      <img
        src={aiAssistantImage}
        alt="AI Assistant"
        className="relative w-full max-w-sm rounded-2xl shadow-lg"
      />
    </div>
  </div>

</div>

      </div>
    </div>
  )
}

export default AiAssitantPage