// project/app/products/[productId]/page.tsx
import { getProductsData, getProductData } from './data'
import ProductClient from './ProductClient'

// Server component that handles data fetching and static generation
export default async function ProductDetailPage({ params }: { params: { productId: string } }) {
  const product = await getProductData(params.productId)
  
  if (!product) {
    return <ProductClient product={null} />
  }
  
  return <ProductClient product={product} />
}

// Required for static generation with dynamic routes
export function generateStaticParams() {
  const products = getProductsData()
  const productIds = Object.keys(products)
  
  // Return them in the format required by generateStaticParams
  return productIds.map(id => ({ productId: id }))
}