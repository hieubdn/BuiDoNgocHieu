
// import { useEffect, useState } from "react";
// import { fetchPrices } from "../utils/fetchPrices";

// const CurrencySwapForm = () => {
//   const [prices, setPrices] = useState([]);
//   const [fromCurrency, setFromCurrency] = useState("");
//   const [toCurrency, setToCurrency] = useState("");
//   const [amount, setAmount] = useState(0);
//   const [convertedAmount, setConvertedAmount] = useState(0);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const getPrices = async () => {
//       const priceData = await fetchPrices();
//       setPrices(priceData);
//     };
//     getPrices();
//   }, []);

//   const handleConvert = async () => {
//     if (!fromCurrency || !toCurrency || amount <= 0) {
//       alert("Vui lòng nhập đầy đủ thông tin hợp lệ!");
//       return;
//     }

//     setLoading(true);

//     try {
//       const fromPrice = prices.find(p => p.currency === fromCurrency)?.price || 0;
//       const toPrice = prices.find(p => p.currency === toCurrency)?.price || 0;
//       if (fromPrice && toPrice) {
//         const rate = toPrice / fromPrice;
//         setConvertedAmount(amount * rate);
//       } else {
//         alert("Không thể tìm thấy tỷ giá hối đoái!");
//       }
//     } catch (error) {
//       console.error("Lỗi:", error);
//       alert("Có lỗi xảy ra, vui lòng thử lại sau!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
//       <h1 className="text-xl font-bold">Currency Swap</h1>

//       <div className="flex flex-col">
//         <label htmlFor="fromCurrency">From Currency</label>
//         <select
//           id="fromCurrency"
//           className="border rounded px-3 py-2"
//           value={fromCurrency}
//           onChange={(e) => setFromCurrency(e.target.value)}
//         >
//           <option value="">Select Currency</option>
//           {prices.map((price) => (
//             <option key={price.currency} value={price.currency}>
//               {price.currency}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="flex flex-col">
//         <label htmlFor="toCurrency">To Currency</label>
//         <select
//           id="toCurrency"
//           className="border rounded px-3 py-2"
//           value={toCurrency}
//           onChange={(e) => setToCurrency(e.target.value)}
//         >
//           <option value="">Select Currency</option>
//           {prices.map((price) => (
//             <option key={price.currency} value={price.currency}>
//               {price.currency}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="flex flex-col">
//         <label htmlFor="amount">Amount</label>
//         <input
//           id="amount"
//           type="number"
//           className="border rounded px-3 py-2"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//         />
//       </div>

//       <button
//         onClick={handleConvert}
//         className={`w-full bg-blue-500 text-white py-2 rounded ${
//           loading ? "opacity-50 cursor-not-allowed" : ""
//         }`}
//         disabled={loading}
//       >
//         {loading ? "Converting..." : "Convert"}
//       </button>

//       {convertedAmount > 0 && (
//         <div className="mt-4">
//           <p>Converted Amount: {convertedAmount.toFixed(2)} {toCurrency}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CurrencySwapForm;



import { useEffect, useState } from "react";
import { fetchPrices } from "../utils/fetchPrices";
import "./CurrencySwapForm.css";

const CurrencySwapForm = () => {
  const [prices, setPrices] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [amount, setAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getPrices = async () => {
      const priceData = await fetchPrices();
      setPrices(priceData);
    };
    getPrices();
  }, []);

  const handleConvert = async () => {
    if (!fromCurrency || !toCurrency || amount <= 0) {
      alert("Please enter valid input!");
      return;
    }

    setLoading(true);
    try {
      const fromPrice = prices.find((p) => p.currency === fromCurrency)?.price || 0;
      const toPrice = prices.find((p) => p.currency === toCurrency)?.price || 0;

      if (fromPrice && toPrice) {
        const rate = toPrice / fromPrice;
        setConvertedAmount(amount * rate);
      } else {
        alert("Exchange rate not found!");
      }
    } catch (error) {
      console.error("Conversion error:", error);
      alert("An error occurred during conversion!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <h1 className="title">Fancy Form</h1>

        <div className="input-group">
          <label htmlFor="fromCurrency" className="label">From Currency</label>
          <select
            id="fromCurrency"
            className="select"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            <option value="">Select Currency</option>
            {prices.map((price) => (
              <option key={price.currency} value={price.currency}>
                {price.currency}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="toCurrency" className="label">To Currency</label>
          <select
            id="toCurrency"
            className="select"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            <option value="">Select Currency</option>
            {prices.map((price) => (
              <option key={price.currency} value={price.currency}>
                {price.currency}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="amount" className="label">Amount</label>
          <input
            id="amount"
            type="number"
            className="input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button
          onClick={handleConvert}
          className={`button ${loading ? "button-loading" : "button-active"}`}
          disabled={loading}
        >
          {loading ? "Converting..." : "Convert"}
        </button>

        {convertedAmount > 0 && (
          <div className="result">
            <p className="result-text">
              Converted Amount: {convertedAmount.toFixed(2)} {toCurrency}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencySwapForm;
