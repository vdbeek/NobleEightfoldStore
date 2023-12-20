"use client"

import {cn, formatPrice} from "@/lib/utils";
import {UseCart} from "@/hooks/use-cart";
import Image from "next/image";
import {useEffect, useState} from "react";
import {PRODUCT_CATEGORIES} from "@/config";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Check, Loader2, X} from "lucide-react";
import { useRouter } from "next/navigation";
import {trpc} from "@/trpc/client";

const Page = () => {
    
    const {items, removeItem} = UseCart()
    
    const router = useRouter()
    
    const {mutate: createCheckoutSession, isLoading} = trpc.payment.createSession.useMutation({
        onSuccess: ({url}) => {
            if(url) router.push(url)
        },
    })
    
    const productIds = items.map(({product}) => product.id)

    const [isMounted, setIsMounted] = useState<boolean>(false)

    useEffect(() => {
        setIsMounted(true)
    }, []);

    const cartTotal = items.reduce((total, {product}) => total + product.price,
        0
    )
    
    const fee = 1

    return (
        <div className='bg-white'>
            <div className='mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8'>
                <h1 className='text-3xl font-bold tracking-tight text-orange-900 sm:text-4xl'>
                    Shopping cart
                </h1>

                <div className='mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16'>
                    <div className={cn(
                        "lg:col-span-7", {
                            "rounded-lg border-2 border-dashed border-zinc-100 p-12":
                                isMounted && items.length === 0
                        },
                    )}>
                        <h2 className='sr-only'>
                            Items in your cart
                        </h2>

                        {isMounted && items.length === 0 ? (
                            <div className='flex h-full flex-col items-center justify-center space-y-1'>
                                <div aria-hidden="true" className='relative mb-4 h-40 w-40 text-muted-foreground'>
                                    <Image
                                        src={'/empty-cart.png'}
                                        alt={'empty cart image'}
                                        priority={true}
                                        sizes="(max-width:1024px)"
                                        fill
                                        loading='eager'
                                    />
                                </div>

                                <h3 className='font-semibold text-2xl'>
                                    Empty cart
                                </h3>
                                <p className='text-muted-foreground'>
                                    Nothing to show
                                </p>
                            </div>
                        ) : null}

                        <ul className={cn({
                                "divide-y divide-gray-200 border-b border-t border-gray-200": isMounted && items.length > 0
                            }
                        )}>
                            {isMounted && items.map(({product}) => {
                                const label = PRODUCT_CATEGORIES.find((c) => c.value === product.category)?.label

                                const {image} = product.images[0]

                                return (
                                    <li key={product.id} className='flex py-6 sm:py-10'>
                                        <div className='flex-shrink-0'>
                                            <div className='relative h-24 w-24'>
                                                {
                                                    typeof image !== "string" && image.url ? (
                                                        <Image
                                                            fill
                                                            src={image.url}
                                                            alt={"product image"}
                                                            priority={true}
                                                            sizes="(max-width:1024px)"
                                                            className='h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48'
                                                        />
                                                    ) : null
                                                }
                                            </div>
                                        </div>

                                        <div className='ml-4 flex flex-1 flex-col justify-between sm:ml-6'>
                                            <div className='relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0'>
                                                <div>
                                                    <div className='flex justify-between'>
                                                        <h3 className='text-sm'>
                                                            <Link
                                                                className='font-medium text-orange-500 hover:text-orange-800'
                                                                href={`/Product/${product.id}`
                                                                }>
                                                                {product.name}
                                                            </Link>
                                                        </h3>
                                                    </div>

                                                    <div className='mt-1 flex text-sm'>
                                                        <p className='text-orange-700'>
                                                            Category: {label}
                                                        </p>
                                                    </div>

                                                    <p className='mt-1 text-sm font-medium text-orange-900'>
                                                        {formatPrice(product.price)}
                                                    </p>
                                                </div>

                                                <div className='mt-4 sm:mt-0 sm:pr-9 w-20'>
                                                    <div className='absolute right-0 top-0'>
                                                        <Button
                                                            variant='ghost'
                                                            onClick={() => {
                                                                removeItem(product.id)
                                                            }}
                                                            aria-label="Remove product from cart">
                                                            <X className='h-5 w-5'
                                                               aria-hidden="true"
                                                            />
                                                        </Button>
                                                    </div>

                                                </div>
                                            </div>

                                            {/* OPTIONAL */}

                                            <p className='mt-4 flex space-x-2 text-sm text-orange-700'>
                                                <Check className='h-5 w-5 flex-shrink-0 text-green-500'/>
                                                <span>
                                                    Instant delivery upon payment
                                                </span>
                                            </p>

                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <section className='mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8'>
                        <h2 className='text-lg font-medium text-orange-900'>
                            Order summary
                        </h2>

                        <div className='mt-6 space-y-4'>
                            <div className='flex items-center justify-between'>

                                <p className='text-sm text-orange-600'>
                                    Subtotal
                                </p>

                                <p className='text-sm font-medium text-orange-900'>
                                    {isMounted ? formatPrice(cartTotal) : (
                                        <Loader2 className='h-4 w-4 animate-spin text-muted-foreground'/>
                                    )}
                                </p>
                            </div>

                            {/* FEE */}
                            <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
                                <div className='flex items-center text-sm text-muted-foreground'>
                                    <span>Transaction fee</span>
                                </div>
                                
                                <div className='text-sm font-medium text-orange-900'>
                                    {isMounted ? formatPrice(fee) :
                                        <Loader2 className='h-4 w-4 animate-spin text-muted-foreground'/>
                                    }
                                </div>
                            </div>

                            {/* TOTAL */}
                            <div className='flex items-center justify-between border-t border-gray-200'>
                                <div className='mt-2 text-base font-medium text-orange-900'>
                                    Order total
                                </div>
                                <div className='mt-2 text-base font-medium text-orange-900'>
                                    {isMounted ? formatPrice(cartTotal + fee) :
                                        <Loader2 className='h-4 w-4 animate-spin text-muted-foreground'/>
                                    }
                                </div>
                            </div>
                        </div>

                        {/* CHECKOUT */}
                        <div className='mt-6'>
                            <Button 
                                disabled={items.length === 0 || isLoading}
                                onClick={() => {
                                    createCheckoutSession({productIds})
                                }}
                                className='w-full' size='lg'>
                                { isLoading ? <Loader2 className='w-4 h-4 animate-spin mr-1.5'/> : null }
                                Checkout
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Page