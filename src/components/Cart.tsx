"use client"

import {Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {ShoppingCartIcon} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {formatPrice} from "@/lib/utils";
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import Image from "next/image";
import {UseCart} from "@/hooks/use-cart";
import {ScrollArea} from "@/components/ui/scroll-area";
import CartItem from "@/components/CartItem";
import {useEffect, useState} from "react";


const Cart = () => {
    const {items} = UseCart()
    const itemCount = items.length
    
    const [isMounted, setIsMounted] = useState<boolean>(false)

    useEffect(() => {
        setIsMounted(true)
    }, []);
    
    const cartTotal = items.reduce((total,{product})=> total + product.price,
        0
    )
    
    const fee = 1
    
    return (<Sheet>
        <SheetTrigger className='group -m-2 flex items-center p-2'>
            <ShoppingCartIcon
                aria-hidden='true'
                className='h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500'/>
            <span className='ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800'>
                {isMounted ? itemCount : 0}
            </span>
        </SheetTrigger>
        <SheetContent className='flex w-full flex-col pr-0 sm:max-w-lg'>
            <SheetHeader className='space-y-2.5 pr-6'>
                <SheetTitle>Cart ({itemCount})</SheetTitle>
            </SheetHeader>
            
            {itemCount > 0 ? (
                <>
                    <div className='flex w-full flex-col pr-6'>
                        <ScrollArea>
                            {items.map(({product}) => (
                                <CartItem 
                                    product={product} 
                                    key={product.id}/>
                            ))}
                        </ScrollArea>
                    </div>
                   
                    <div className='space-y-4 pr-6'>
                        <Separator />
                        <div className='space-y-1.5 text-small'>
                            <div className='flex'>
                                <span className='flex-1'>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className='flex'>
                                <span className='flex-1'>Transaction Fee</span>
                                <span>{formatPrice(fee)}</span>
                            </div>
                            <div className='flex'>
                                <span className='flex-1'>Total</span>
                                <span>{formatPrice(cartTotal + fee)}</span>
                            </div>
                        </div>
                        
                        <SheetFooter>
                            <SheetTrigger asChild>
                                <Link href='/Cart' className={buttonVariants({
                                    className:"w-full",
                                })}>
                                    Checkout
                                </Link>
                            </SheetTrigger>
                        </SheetFooter>
                    </div>
                </>
            ) : (
                <div aria-hidden='true'
                    className='flex h-full flex-col items-center justify-center space-y-1'>
                    <div className='relative mb-4 h-60 w-60 text-muted-foreground'>
                        <Image 
                            priority={true}
                            sizes="(max-width:1024px)"
                            src={'/empty-cart.png'} 
                            alt={'empty cart image'} 
                            fill/>
                    </div>
                    <div className='text-xl font-semibold'>Shopping cart is empty</div>
                    <SheetTrigger asChild>
                        <Link href='/products' className={buttonVariants({
                            variant: 'link',
                            size: 'sm',
                            className: 'text-sm text-muted-foreground'
                        })}>
                            Browse products
                        </Link>
                    </SheetTrigger>
                </div>
            )}
        </SheetContent>
    </Sheet>)
}

export default Cart