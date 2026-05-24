import { useLocalStorage } from './useLocalStorage'

const DEFAULTS = [
  { id: '1', symbol: 'SOLUSDT', amount: 0 },
  { id: '2', symbol: 'BTCUSDT', amount: 0 },
  { id: '3', symbol: 'ETHUSDT', amount: 0 },
]

export function usePortfolio() {
  const [holdings, setHoldings] = useLocalStorage('addi_portfolio', DEFAULTS)

  const updateAmount = (symbol, amount) => {
    const num = parseFloat(amount) || 0
    setHoldings(prev =>
      prev.map(h => h.symbol === symbol ? { ...h, amount: num } : h)
    )
  }

  const totalValue = (prices) => {
    if (!prices) return 0
    return holdings.reduce((sum, h) => {
      const price = prices[h.symbol]?.price || 0
      return sum + price * h.amount
    }, 0)
  }

  const coinValue = (symbol, prices) => {
    if (!prices) return 0
    const price = prices[symbol]?.price || 0
    const holding = holdings.find(h => h.symbol === symbol)
    return price * (holding?.amount || 0)
  }

  return { holdings, updateAmount, totalValue, coinValue }
}
