"use client"

import {Button} from "./ui/button"
import {useEffect, useState} from "react";
import {UseCart} from "@/hooks/use-cart";
import type {Product} from "@/payload-types";

const AddToCartButton = ({product}: {product: Product}) => {
    
    const {addItem} = UseCart()
    
    const [isSuccess, setIsSuccess] = useState<boolean>(false)

    useEffect(() => {
        const timeout = setTimeout(()=>{
            setIsSuccess(false)
        },2000)
        
        return () => clearTimeout(timeout)
    }, [isSuccess]);
    
    return (
        <Button 
            onClick={() => {
                addItem(product)
                setIsSuccess(true)
            }}
            size='lg' 
            className='w-full'>
            {isSuccess ? 'Added to cart!' : 'Add to cart'}
        </Button>
    )
}

export default AddToCartButton