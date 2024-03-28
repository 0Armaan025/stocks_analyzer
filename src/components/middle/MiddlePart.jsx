import React, { useState } from "react";
import axios from "axios";

const MiddlePart = () => {
  const [stockSymbols, setStockSymbols] = useState(
    Array.from({ length: 6 }, () => "")
  );
  const [stocksData, setStocksData] = useState(
    Array.from({ length: 6 }, () => ({}))
  );
  const [error, setError] = useState("");

  const handleInputChange = (index, value) => {
    const newStockSymbols = [...stockSymbols];
    newStockSymbols[index] = value;
    setStockSymbols(newStockSymbols);
  };

  const filterStockData = (data) => {
    const statsObject = {
      "Market Cap": data["Market Cap"] || "-",
      "Current Price": data["Current Price"] || "-",
      "Book Value": data["Book Value"] || "-",
      "Dividend Yield": data["Dividend Yield"] || "-",
      ROCE: data["ROCE"] || "-",
      ROE: data["ROE"] || "-",
      "Face Value": data["Face Value"] || "-",
      "Stock P/E": data["Stock P/E"] || "-",
      "EPS in Rs": data["EPS in Rs"] || "-",
      "Compounded Sales Growth (10 Years:)":
        data["Compounded Sales Growth"]?.["10 Years:"] || "-",
      "Compounded Sales Growth (5 Years:)":
        data["Compounded Sales Growth"]?.["5 Years:"] || "-",
      "Compounded Sales Growth (3 Years:)":
        data["Compounded Sales Growth"]?.["3 Years:"] || "-",
      "Compounded Sales Growth (TTM:)":
        data["Compounded Sales Growth"]?.["TTM:"] || "-",
      "Compounded Profit Growth (10 Years:)":
        data["Compounded Profit Growth"]?.["10 Years:"] || "-",
      "Compounded Profit Growth (5 Years:)":
        data["Compounded Profit Growth"]?.["5 Years:"] || "-",
      "Compounded Profit Growth (3 Years:)":
        data["Compounded Profit Growth"]?.["3 Years:"] || "-",
      "Compounded Profit Growth (TTM:)":
        data["Compounded Profit Growth"]?.["TTM:"] || "-",
      "Return on Equity (10 Years:)":
        data["Return on Equity"]?.["10 Years:"] || "-",
      "Return on Equity (5 Years:)":
        data["Return on Equity"]?.["5 Years:"] || "-",
      "Return on Equity (3 Years:)":
        data["Return on Equity"]?.["3 Years:"] || "-",
      "Return on Equity (Last Year:)":
        data["Return on Equity"]?.["Last Year:"] || "-",
      "Stock Price CAGR (10 Years:)":
        data["Stock Price CAGR"]?.["10 Years:"] || "-",
      "Stock Price CAGR (5 Years:)":
        data["Stock Price CAGR"]?.["5 Years:"] || "-",
      "Stock Price CAGR (3 Years:)":
        data["Stock Price CAGR"]?.["3 Years:"] || "-",
      "Stock Price CAGR (1 Year:)":
        data["Stock Price CAGR"]?.["1 Year:"] || "-",
    };

    return statsObject;
  };

  const handleSubmit = async () => {
    try {
      const updatedStocksData = [];

      // Create an array of promises for fetching stock data
      const promises = stockSymbols.map(async (symbol) => {
        if (!symbol) return; // Skip empty symbols

        let retries = 0;
        let stockData = null;

        // Retry fetching data for a maximum of 3 times
        while (retries < 3 && !stockData) {
          const response = await axios.get(
            `https://screener-api-custom-flask.vercel.app/stock-details/${symbol}`
          );
          stockData = response.data;

          if (!stockData) {
            retries++;
          }
        }

        // If data is still not available after retries, push an empty object
        if (!stockData) {
          updatedStocksData.push({});
          return;
        }

        const filteredStockData = filterStockData(stockData);
        updatedStocksData.push(filteredStockData); // Push filtered data to the array
      });

      // Wait for all promises to resolve
      await Promise.all(promises);

      // Once all promises are resolved, update the state with filtered data
      setStocksData(updatedStocksData);
    } catch (error) {
      setError("Error fetching stock data: " + error.message);
    }
  };

  const metrics = [
    "Market Cap",
    "Current Price",
    "Book Value",
    "Dividend Yield",
    "ROCE",
    "ROE",
    "Face Value",
    "Stock P/E",
    "EPS in Rs",
    "Compounded Sales Growth (10 Years:)",
    "Compounded Sales Growth (5 Years:)",
    "Compounded Sales Growth (3 Years:)",
    "Compounded Sales Growth (TTM:)",
    "Compounded Profit Growth (10 Years:)",
    "Compounded Profit Growth (5 Years:)",
    "Compounded Profit Growth (3 Years:)",
    "Compounded Profit Growth (TTM:)",
    "Return on Equity (10 Years:)",
    "Return on Equity (5 Years:)",
    "Return on Equity (3 Years:)",
    "Return on Equity (Last Year:)",
    "Stock Price CAGR (10 Years:)",
    "Stock Price CAGR (5 Years:)",
    "Stock Price CAGR (3 Years:)",
    "Stock Price CAGR (1 Year:)",
  ];

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
          {error && <p>{error}</p>}
          <table className="w-[80%]" style={{ background: "#1b2334" }}>
            <thead>
              <tr>
                <th className="bg-slate-600 text-white px-4 py-2">Metrics</th>
                {stockSymbols.map((symbol, index) => (
                  <th key={index} className="bg-slate-600 text-white px-4 py-2">
                    {symbol || `Stock ${index + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border px-4 py-2 text-white whitespace-nowrap w-[12%]">
                    {metric}
                  </td>
                  {stocksData.map((stockData, colIndex) => (
                    <td
                      key={colIndex}
                      className="border px-4 py-2 whitespace-nowrap w-[8%] text-white"
                    >
                      {stockData[metric]
                        ? metric === "EPS in Rs"
                          ? stockData[metric]["Dec 2020"]
                          : stockData[metric]
                        : ""}
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
