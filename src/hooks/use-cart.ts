﻿import {create} from "zustand"
import type {Product} from "@/payload-types";
import {createJSONStorage, persist} from "zustand/middleware"

// CART STATE
export type CartItem = {
    product: Product
}

type CartState = {
    items: CartItem[]
    addItem: (product: Product) => void
    removeItem: (productId: string) => void
    clearCart: () => void
}
export const UseCart = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            addItem: (product) => set((state) => {
                return {items: [...state.items, {product}]}
            }),
            removeItem: (id) => set((state) => ({
                items: state.items.filter((item)=> item.product.id !== id)
            })),
            clearCart: () => set({items:[]})
        }),{
            name:"cart-storage",
            storage: createJSONStorage(() => localStorage)
        }
    )
)