import React, { useState } from "react";
import axios from "axios";

const MiddlePart = () => {
  // State to store input data for each stock
  const [stockSymbols, setStockSymbols] = useState(
    Array.from({ length: 6 }, () => "")
  );

  // State to store data for each stock
  const [stocksData, setStocksData] = useState(
    Array.from({ length: 6 }, () => [])
  );

  // Function to handle input change for each stock
  const handleInputChange = (index, value) => {
    const newStockSymbols = [...stockSymbols];
    newStockSymbols[index] = value;
    setStockSymbols(newStockSymbols);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      const updatedStocksData = [];

      // Loop through each stock symbol and send a request to the backend
      for (let i = 0; i < stockSymbols.length; i++) {
        const symbol = stockSymbols[i];
        const response = await axios.get(
          `http://127.0.0.1:5000/stock-details/${symbol}`
        );

        // Process the response data and update your table accordingly
        const stockData = response.data;
        console.log("Stock Data:", stockData);

        // Push the data for the current stock to the updatedStocksData array
        updatedStocksData.push(stockData);
      }

      // Update the state with the new stock data
      setStocksData(updatedStocksData);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  return (
    <>
      <div className="middlePart">
        <center>
          <h3
            className="text-white text-4xl py-4 px-2"
            style={{ fontFamily: "Poppins" }}
          >
            Stock Analyzer
          </h3>
        </center>
        <div className="inputFields flex flex-row justify-center items-center">
          {stockSymbols.map((symbol, index) => (
            <input
              key={index}
              type="text"
              placeholder="Enter Symbol here"
              value={symbol}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="bg-white px-2 py-1 w-[190px] outline-none rounded-sm m-2"
            />
          ))}
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
        <br />
        <center>
          <table className="w-[80%] " style={{ background: "#1b2334" }}>
            <thead>
              <tr>
                <th className="bg-slate-600 text-white px-4 py-2">Metrics</th>
                {stockSymbols.map((symbol, index) => (
                  <th
                    key={index}
                    className="bg-slate-600 text-white px-4 py-2 "
                  >
                    {symbol || `Stock ${index + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                "Market Cap",
                "Price",
                "Book Value",
                "Dividend Yield",
                "ROCE",
                "ROE",
                "Face Value",
                "Stock P/E",
                "EPS",
                "Compounded Sales Growth (10 years)",
                "Compounded Sales Growth (5 years)",
                "Compounded Sales Growth (3 years)",
                "Compounded Sales Growth (TTM)",
                "Compounded Sales Growth (10 years)",
                "Compounded Profit Growth (5 years)",
                "Compounded Profit Growth (3 years)",
                "Compounded Profit Growth (TTM)",
                "Return on Equity (10 years)",
                "Return on Equity (5 years)",
                "Return on Equity (3 years)",
                "Return on Equity (Last year)",
                "Stock Price CAGR (10 years)",
                "Stock Price CAGR (5 years)",
                "Stock Price CAGR (3 years)",
                "Stock Price CAGR (1 year)",
              ].map((metric, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border px-4 py-2 text-white whitespace-nowrap w-[12%]">
                    {metric}
                  </td>
                  {stocksData.map((stockData, colIndex) => (
                    <td
                      key={colIndex}
                      className="border px-4 py-2 whitespace-nowrap w-[8%] text-white"
                    >
                      {stockData[rowIndex]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <br />
        </center>
        <br />
      </div>
    </>
  );
};

export default MiddlePart;
