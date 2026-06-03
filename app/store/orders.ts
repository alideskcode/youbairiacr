import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface OrderItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string
  category: string
  seller: string
}

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  date: string
  status: "pending" | "completed"
}

interface OrderStore {
  orders: Order[]
  addOrder: (items: OrderItem[], total: number) => void
  getOrder: (id: string) => Order | undefined
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (items, total) => {
        const newOrder: Order = {
          id: Math.random().toString(36).substring(7),
          items,
          total,
          date: new Date().toISOString(),
          status: "completed"
        }
        set((state) => ({
          orders: [newOrder, ...state.orders]
        }))
      },
      getOrder: (id) => {
        return get().orders.find(order => order.id === id)
      }
    }),
    {
      name: "order-storage"
    }
  )
) 