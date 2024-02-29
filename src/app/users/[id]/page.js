"use client"

import { useParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getUser } from "@/actions/server-actions";

export default function PageDetail() {
    const params = useParams();
    const router = useRouter();
    const [userState, setUserState] = useState();
    const { id } = params;

    useEffect(() => {
        (async () => {
            const { data } = await getUser({ id, token: Cookies.get("accessToken") });

            if (data.success) {
                setUserState(data.data.user);
            } else {
                Cookies.remove("accessToken");
                router.push('/login');
            }
        })();
    }, []);

    return (
        <div className="container mx-a pt-5">
            {
                !userState ? 
                <h2>Not found user!</h2> : (
                    <Fragment>
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <h2>Thông tin chi tiết</h2>
                            <a href="/" className="btn">Trở lại</a>
                        </div>
                        <img className="mb-3" src={`${userState?.thumbnail}`} alt="" />
                        <p>Tên: { userState?.name }</p>
                        <p>Email: { userState?.email }</p>
                        <p>Provider: { userState?.Providers[0].provider }</p>
                    </Fragment>
                )
            }
        </div>
    )
}