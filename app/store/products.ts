import { create } from "zustand"

export interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string
  seller: string
}

interface ProductStore {
  products: Product[]
  addProduct: (product: Product) => void
  removeProduct: (id: string) => void
  updateProduct: (id: string, product: Partial<Product>) => void
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    })),
  updateProduct: (id, updatedProduct) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, ...updatedProduct } : product
      ),
    })),
})) 