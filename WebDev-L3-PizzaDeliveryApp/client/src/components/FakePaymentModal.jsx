import { useState } from 'react';

const FakePaymentModal = ({ amount, onSuccess, onClose }) => {
  const [step, setStep] = useState('card'); // card | processing | success
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' });

  const handlePay = () => {
    if (!card.number || !card.expiry || !card.cvv) {
      alert('Shob field fill koro (dummy data e cholbe)');
      return;
    }
    setStep('processing');

    // Fake network delay, real Razorpay er moto lagbe
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess({
          razorpay_payment_id: 'pay_demo_' + Date.now(),
          razorpay_order_id: 'order_demo_' + Date.now(),
        });
      }, 1200);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[380px] shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#0c2451] text-white px-5 py-4 flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">Payment to</p>
            <p className="font-semibold">PizzaHub</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-xl">
            &times;
          </button>
        </div>

        <div className="p-5">
          {step === 'card' && (
            <>
              <p className="text-2xl font-bold mb-4">৳{amount}</p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Card Number"
                  maxLength={19}
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
                />
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                    className="w-1/2 border rounded px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    maxLength={3}
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                    className="w-1/2 border rounded px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>
              <button
                onClick={handlePay}
                className="w-full mt-5 bg-[#0c2451] text-white py-2.5 rounded font-medium hover:opacity-90 transition-opacity"
              >
                Pay ৳{amount}
              </button>
              <p className="text-xs text-gray-400 mt-3 text-center">
                Demo mode — no real charge. Test card: 4111 1111 1111 1111
              </p>
            </>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0c2451] rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Processing payment...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-12 flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <p className="font-medium text-green-700">Payment Successful</p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 text-center text-xs text-gray-400 py-2 border-t">
          Secured by Razorpay (Demo)
        </div>
      </div>
    </div>
  );
};

export default FakePaymentModal;
