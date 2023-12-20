"use client"

import {trpc} from "@/trpc/client";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

interface PaymentStatusProps {
    orderEmail: string
    orderId: string
    isPaid: boolean
}

const PaymentStatus = ({orderEmail, orderId, isPaid}: PaymentStatusProps) => {
    
    const router = useRouter()
    
    const {data} = trpc.payment.pollOrderStatus.useQuery({orderId},{
        enabled: !isPaid,
        refetchInterval: (data) => (data?.isPaid ? false : 1000)
    })

    useEffect(() => {
        if(data?.isPaid) router.refresh()
    }, [data?.isPaid,router]);
    
    return(
        <div className='mt-16 grid grid-cols-2 gap-x-4 text-orange-600'>
            <div>
                <p className='font-medium text-orange-900'>
                    Shipping to
                </p>
                <p>
                    {orderEmail}
                </p>
            </div>
            
            <div>
                <p className='font-medium text-orange-900'>
                    Order status
                </p>
                <p>
                    {
                        isPaid ? "Payment successful" : "Pending payment..."
                    }
                </p>
            </div>
        </div>
    )
}

export default PaymentStatus