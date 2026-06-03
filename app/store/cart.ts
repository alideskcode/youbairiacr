import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string
  category: string
  seller: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const quantity = item.quantity ?? 1
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                id: item.id,
                title: item.title,
                price: item.price,
                image: item.image,
                category: item.category,
                seller: item.seller,
                quantity,
              },
            ],
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
    }
  )
)
