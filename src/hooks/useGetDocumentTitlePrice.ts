import { useEffect } from 'react'
import { usePYEBusdPrice } from 'hooks/useBUSDPrice'

const useGetDocumentTitlePrice = () => {
  const pyePriceBusd = usePYEBusdPrice()
  useEffect(() => {
    const pyePriceBusdString = pyePriceBusd ? pyePriceBusd.toFixed(2) : ''
    document.title = `PYE Swap - ${pyePriceBusdString}`
  }, [pyePriceBusd])
}
export default useGetDocumentTitlePrice
