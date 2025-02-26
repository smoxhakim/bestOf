import { getProductData } from "@/lib/products"
import ProductClient from "./ProductClient"

export default async function ProductDetailPage({ params }: { params: { productId: string } }) {
  const product = await getProductData(params.productId)

  if (!product) {
    return <ProductClient product={null} />
  }

  return <ProductClient product={product} />
}


