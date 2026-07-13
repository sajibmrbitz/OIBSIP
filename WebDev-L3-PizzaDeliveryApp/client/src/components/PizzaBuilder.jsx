import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemCard from './ItemCard';

const PizzaBuilder = ({ bases, sauces, cheeses, vegetables }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({
    base: null,
    sauce: null,
    cheese: null,
    vegetables: [],
  });

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleReview = () => {
    navigate('/order-summary', { state: { selection } });
  };

  const toggleVegetable = (veg) => {
    setSelection((prev) => {
      const exists = prev.vegetables.find((v) => v.id === veg.id);
      if (exists) {
        return { ...prev, vegetables: prev.vegetables.filter((v) => v.id !== veg.id) };
      } else {
        return { ...prev, vegetables: [...prev.vegetables, veg] };
      }
    });
  };

  const renderOptions = (items, type, selectedItem, onSelect) => (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          name={item.name}
          itemType={type}
          selected={selectedItem?.id === item.id}
          onClick={() => onSelect(item)}
          price={type === 'base' ? '৳150' : type === 'sauce' ? '৳30' : '৳50'}
        />
      ))}
    </div>
  );

  const renderVegetables = () => (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {vegetables.map((item) => {
        const isSelected = selection.vegetables.some((v) => v.id === item.id);
        return (
          <ItemCard
            key={item.id}
            name={item.name}
            itemType="vegetable"
            selected={isSelected}
            onClick={() => toggleVegetable(item)}
            price="৳20"
          />
        );
      })}
    </div>
  );

  return (
    <div className="mt-8 rounded-2xl bg-white p-6 md:p-8 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800">Build Your Pizza</h3>
        <div className="rounded-full bg-orange-100 px-4 py-1 text-sm font-bold text-orange-600">
          Step {step} of 4
        </div>
      </div>

      <div className="mb-8">
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500 ease-out"
            style={{ width: `\${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-10 min-h-[300px]">
        {step === 1 && (
          <div>
            <h4 className="mb-6 text-xl font-bold text-gray-700">1. Choose your Base</h4>
            {renderOptions(bases, 'base', selection.base, (item) =>
              setSelection({ ...selection, base: item })
            )}
          </div>
        )}
        {step === 2 && (
          <div>
            <h4 className="mb-6 text-xl font-bold text-gray-700">2. Choose your Sauce</h4>
            {renderOptions(sauces, 'sauce', selection.sauce, (item) =>
              setSelection({ ...selection, sauce: item })
            )}
          </div>
        )}
        {step === 3 && (
          <div>
            <h4 className="mb-6 text-xl font-bold text-gray-700">3. Choose your Cheese</h4>
            {renderOptions(cheeses, 'cheese', selection.cheese, (item) =>
              setSelection({ ...selection, cheese: item })
            )}
          </div>
        )}
        {step === 4 && (
          <div>
            <h4 className="mb-2 text-xl font-bold text-gray-700">4. Choose Vegetables</h4>
            <p className="mb-6 text-sm text-gray-500">Select as many as you like.</p>
            {renderVegetables()}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-6">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className={`rounded-xl px-8 py-3 font-bold transition-all \${
            step === 1
              ? 'cursor-not-allowed bg-gray-50 text-gray-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Back
        </button>

        {step < 4 ? (
          <button
            onClick={handleNext}
            disabled={
              (step === 1 && !selection.base) ||
              (step === 2 && !selection.sauce) ||
              (step === 3 && !selection.cheese)
            }
            className="disabled:cursor-not-allowed disabled:opacity-50 rounded-xl bg-orange-500 px-8 py-3 font-bold text-white shadow-md shadow-orange-200 hover:bg-orange-600 hover:-translate-y-0.5 transition-all"
          >
            Next Step
          </button>
        ) : (
          <button
            onClick={handleReview}
            className="rounded-xl bg-green-500 px-8 py-3 font-bold text-white shadow-lg shadow-green-200 hover:bg-green-600 hover:-translate-y-0.5 transition-all"
          >
            Review Order
          </button>
        )}
      </div>
    </div>
  );
};

export default PizzaBuilder;
