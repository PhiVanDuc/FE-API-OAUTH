"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function page({ searchParams }) {
    const queryString = new URLSearchParams(searchParams).toString();
    const router = useRouter();
    
    useEffect(() => {
        const dataUser = async () => {
            try {
                console.log(queryString);
                const dataUrl = await fetch(
                    "https://node-api-oauth-alpha.vercel.app//auth/google/callback?" + queryString
                );
    
                const { accessToken, refreshToken } = await dataUrl.json();

                if (accessToken && refreshToken) {
                    Cookies.set('accessToken', accessToken, { expires: 0.04, path: '/' });
                    Cookies.set('refreshToken', refreshToken, { expires: 14, path: '/' });
                }
                
                router.push('/');
            } catch (e) {
                console.log(e);
            }
        };

        dataUser();
    }, []);

    return <div>Redirecting...</div>;
}
