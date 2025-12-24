

const BlockchainIntegration = () => {
  return (
    <div className="min-h-screen bg-white px-6 md:px-16 py-12">

  {/* Header */}
  <div className="max-w-4xl mx-auto text-center mb-16">
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
      Blockchain Integration
    </h1>

    <div className="w-20 h-1 bg-orange-700 mx-auto mt-4 rounded-full"></div>

    <p className="mt-6 text-gray-600 text-lg leading-relaxed">
      We integrate blockchain technology to bring secure, transparent, and
      future-ready experiences into everyday transactions — without
      complexity for users.
    </p>
  </div>

  {/* Main Content */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center max-w-6xl mx-auto">

    {/* Left – Text */}
    <div className="space-y-6">

      <h2 className="text-2xl font-semibold text-gray-900">
        Why Blockchain?
      </h2>

      <p className="text-gray-600 leading-relaxed">
        Blockchain allows us to build trust directly into the system.
        Every transaction is verifiable, secure, and tamper-resistant —
        giving users confidence while keeping the experience smooth.
      </p>

      {/* Features */}
      <div className="space-y-4 pt-2">

        <div className="flex gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-100 text-orange-700">
            🔒
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              Secure Payments
            </h4>
            <p className="text-gray-600 text-sm">
              Blockchain-backed transactions reduce fraud and ensure
              payment integrity.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-100 text-orange-700">
            📜
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              Transparent Records
            </h4>
            <p className="text-gray-600 text-sm">
              Orders and payments can be verified on-chain, building trust
              between users and vendors.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-100 text-orange-700">
            ⚡
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              Fast & Low-Cost Transactions
            </h4>
            <p className="text-gray-600 text-sm">
              Optimized for modern blockchain networks with minimal fees
              and instant confirmations.
            </p>
          </div>
        </div>

      </div>
    </div>

    {/* Right – Visual Card */}
    <div className="relative flex justify-center">
      <div className="absolute -inset-4 bg-orange-700/20 blur-2xl rounded-3xl"></div>

      <div className="relative bg-white border rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Blockchain Use Cases
        </h3>

        <ul className="space-y-4 text-gray-600">
          <li className="flex gap-3">
            <span className="text-orange-700">✔</span>
            Crypto & wallet-based food payments
          </li>
          <li className="flex gap-3">
            <span className="text-orange-700">✔</span>
            Smart contracts for order confirmation
          </li>
          <li className="flex gap-3">
            <span className="text-orange-700">✔</span>
            On-chain order receipts & proof of payment
          </li>
          <li className="flex gap-3">
            <span className="text-orange-700">✔</span>
            Seamless Web2 → Web3 onboarding
          </li>
        </ul>
      </div>
    </div>

  </div>

  {/* Upcoming Features */}
  <div className="max-w-5xl mx-auto mt-24 text-center">
    <h2 className="text-3xl font-bold text-gray-900">
      🚀 What’s Coming Next
    </h2>

    <p className="mt-4 text-gray-600">
      We’re expanding our blockchain layer to unlock even more powerful features.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

      <div className="border rounded-xl p-6 hover:shadow-md transition">
        <h4 className="font-semibold text-gray-900">
          AI + Blockchain Payments
        </h4>
        <p className="text-gray-600 text-sm mt-2">
          Use AI commands like “Pay with wallet” directly from the chat assistant.
        </p>
      </div>

      <div className="border rounded-xl p-6 hover:shadow-md transition">
        <h4 className="font-semibold text-gray-900">
          Loyalty Tokens
        </h4>
        <p className="text-gray-600 text-sm mt-2">
          Earn blockchain-based reward tokens for every order.
        </p>
      </div>

      <div className="border rounded-xl p-6 hover:shadow-md transition">
        <h4 className="font-semibold text-gray-900">
          Vendor Smart Contracts
        </h4>
        <p className="text-gray-600 text-sm mt-2">
          Automated vendor payouts powered by secure smart contracts.
        </p>
      </div>

    </div>
  </div>

</div>

  )
}

export default BlockchainIntegration