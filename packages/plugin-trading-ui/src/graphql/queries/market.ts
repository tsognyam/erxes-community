const tradingOrderBook = `
query tradingOrderBook($stockcode: Int) {
    tradingOrderBook(stockcode: $stockcode)
  }
`;
const tradingExecutedBook = `
query tradingExecutedBook($stockcode: Int, $endDate: Date, $beginDate: Date) {
    tradingExecutedBook(stockcode: $stockcode, endDate: $endDate, beginDate: $beginDate)
  }
`;
export default {
  tradingOrderBook,
  tradingExecutedBook
};
