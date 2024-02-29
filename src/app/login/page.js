"use client"

import React, { useEffect, useState } from 'react'

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getUrlRedirect } from '@/actions/server-actions';

export default function page() {
    const router = useRouter();
    const [appearState, setAppearState] = useState(false);

    useEffect(() => {
        if (Cookies.get("accessToken")) {
            setAppearState(false);
            router.push('/');
        } else {
            setAppearState(true);
        }
    }, []);

    const handleClick = async () => {
        const { data } = await getUrlRedirect();

        router.push(data.result.urlRedirect);
    }

    if (appearState) {
        return (
            <div className='container mx-a pt-5'>
                <h2 className='fs-4 fw-semibold mb-3'>Đăng nhập</h2>
                <button className='btn btn-primary' onClick={ handleClick }>Google</button>
            </div>
        )
    }
}