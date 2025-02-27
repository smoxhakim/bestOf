// app/products/[productId]/error.ts
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}

export async function getProductData(id: string): Promise<ProductDetailed | null> {
  try {
    // Using your existing mock data for now
    const products = getProductsData()
    return products[id] || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}