

const Order = () => {
  return (
   <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">

  {/* Hero Section */}
  <section className="text-center space-y-4">
    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
      How to Order
    </h1>
    <p className="text-gray-600 max-w-xl mx-auto">
      Ordering your favorite meals is simple, fast, and secure. 
      Here’s how you can place an order today — and what exciting features are coming next.
    </p>
  </section>

  {/* Current Order Process */}
  <section className="space-y-10">
    <h2 className="text-2xl font-semibold text-gray-900 text-center">
      Order in 3 Easy Steps
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        {
          step: "1",
          title: "Browse Meals",
          desc: "Explore meals from different vendors and cuisines. View prices, images, and details before choosing.",
        },
        {
          step: "2",
          title: "Add to Cart",
          desc: "Select your meals and add them to your cart. You can review, update, or remove items anytime.",
        },
        {
          step: "3",
          title: "Checkout & Track",
          desc: "Confirm your order and track delivery progress in real time until it reaches you.",
        },
      ].map((item) => (
        <div
          key={item.step}
          className="bg-white p-6 rounded-xl shadow-sm border"
        >
          <span className="text-orange-600 font-bold text-xl">
            Step {item.step}
          </span>
          <h3 className="text-lg font-semibold mt-2">
            {item.title}
          </h3>
          <p className="text-gray-600 mt-2">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  </section>

  {/* AI Ordering – Coming Soon */}
  <section className="space-y-6">
    <div className="flex items-center gap-3">
      <h2 className="text-2xl font-semibold text-gray-900">
        AI-Powered Ordering
      </h2>
      <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
        Coming Soon
      </span>
    </div>

    <p className="text-gray-600 max-w-2xl">
      Soon, you won’t need to search through menus. Our AI Assistant will help
      you order meals using simple conversations — fast, smart, and stress-free.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        "Ask the AI what to eat based on your mood or budget",
        "Add meals to your cart by chatting naturally",
        "Get personalized recommendations from past orders",
      ].map((feature) => (
        <div
          key={feature}
          className="bg-gray-50 p-5 rounded-lg border"
        >
          <p className="text-gray-700">{feature}</p>
        </div>
      ))}
    </div>
  </section>

  {/* Blockchain Payments – Coming Soon */}
  <section className="space-y-6">
    <div className="flex items-center gap-3">
      <h2 className="text-2xl font-semibold text-gray-900">
        Blockchain Payments
      </h2>
      <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
        Coming Soon
      </span>
    </div>

    <p className="text-gray-600 max-w-2xl">
      We’re introducing secure blockchain payments to give you more control,
      transparency, and flexibility when paying for your meals.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        "Pay with supported crypto wallets",
        "Transparent and secure transactions",
        "Faster confirmation with reduced fees",
      ].map((feature) => (
        <div
          key={feature}
          className="bg-gray-50 p-5 rounded-lg border"
        >
          <p className="text-gray-700">{feature}</p>
        </div>
      ))}
    </div>
  </section>

  {/* CTA */}
  <section className="text-center space-y-4">
    <h3 className="text-xl font-semibold">
      Ready to order?
    </h3>
    <p className="text-gray-600">
      Start ordering now and stay tuned for AI-powered ordering and blockchain payments.
    </p>
    <button
      className="
        bg-orange-600 text-white px-8 py-3 rounded-xl
        font-semibold transition
        hover:bg-orange-700 active:scale-95
      "
    >
      Explore Menu
    </button>
  </section>

</div>

  )
}

export default Order