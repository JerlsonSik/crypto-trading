import config from "../../utility/configs.js";
import ccxt from "ccxt";

// Initialize Binance client
const client = new ccxt.binance({
  apiKey: config.BINANCE_API_KEY,
  secret: config.BINANCE_API_SECRET,
});

const futuresClient = new ccxt.binance({
  apiKey: config.BINANCE_API_KEY,
  secret: config.BINANCE_API_SECRET,
  options: {
    defaultType: "future",
  },
});

const testFundingRatesRouter = async (req, res) => {
  try {
    return res.status(200).json("Successfully hit FundingRates router");
  } catch (err) {
    return res.status(400).json({ error: `testTradeRouter Error: ${err}` });
  }
};

const getCurrentFundingRates = async (req, res) => {
  try {
    // Fetch funding rates
    const fundingRates = await futuresClient.fetchFundingRates();

    // Fetch funding intervals
    const fundingIntervals = await futuresClient.fetchFundingIntervals();

    // Filter funding rates where fundingRate < -0.001
    const filteredRates = Object.values(fundingRates).filter(
      (rate) => rate.fundingRate < -0.001
    );

    // Merge filtered rates with funding intervals
    const mergedData = filteredRates.map((rate) => {
      const intervalData = fundingIntervals[rate.symbol]; // Match with fundingIntervals
      return {
        symbol: rate.info.symbol,
        datetime: rate.datetime,
        fundingRate: rate.fundingRate,
        fundingTimestamp: rate.fundingDatetime,
        interval: intervalData ? intervalData.interval : null, // Add interval if available
      };
    });

    return res.status(200).json({ mergedData });
  } catch (err) {
    return res
      .status(400)
      .json({ error: `getCurrentFundingRates Error: ${err}` });
  }
};

const getFundingIntervals = async (req, res) => {
  try {
    const fundingIntervals = await futuresClient.fetchFundingIntervals();

    return res.json({ fundingIntervals });
  } catch (err) {
    return res.status(400).json({ error: `getFundingIntervals Error: ${err}` });
  }
};

const getFundingHistory = async (req, res) => {
  const { symbol } = req.body;
  try {
    const fundingHistory = await futuresClient.fetchFundingHistory();
    return res.status(200).json({ fundingHistory });
  } catch (err) {
    return res.status(400).json({ error: `getFundingHistory Error: ${err}` });
  }
};

export {
  testFundingRatesRouter,
  getCurrentFundingRates,
  getFundingIntervals,
  getFundingHistory,
};
