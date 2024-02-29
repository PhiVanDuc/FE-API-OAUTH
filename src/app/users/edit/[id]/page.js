"use client"

import { useEffect, useState, useRef } from "react";
import { editUser, getUser } from "@/actions/server-actions";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";

export default function PageEdit() {
    const { id } = useParams();
    const router = useRouter();
    const [name, setName] = useState('');
    const tokenRef = useRef(Cookies.get("accessToken"));
    const [foundState, setFoundState] = useState(true);

    useEffect(() => {
        (async () => {
            const { data } = await getUser({ id, token: tokenRef.current });

            if (!data.data.user) {
                setFoundState(false);
            }
            else if (data.data.user) {
                setName(data.data.user.name);
                setFoundState(true);
            } else if (!data.success) {
                Cookies.remove("accessToken");
                router.push('/login');
            }
        })();
    }, []);

    const handleChangeName = (event) => {
        setName(event.target.value);
    }

    const handleClickEdit = async () => {
        const { data } = await editUser({ id, name, token: tokenRef.current });

        if (!data.success) {
            Cookies.remove("accessToken");
            router.push('/login');
        } else {
            router.push('/');
        }
    }

    if (!foundState) {
        return <h2>Not found user!</h2>
    }

    return (
        <div className="container mx-auto pt-5">
            <h2 className="mb-5">Edit user.</h2>

            <form>
                <label htmlFor="" className="mb-2 fw-semibold">Name</label>
                <input type="text" placeholder="Name..." name="name" className="form-control mb-3" value={ name } onChange={ handleChangeName } />

                <button type="button" className="btn btn-primary" onClick={ handleClickEdit }>Save change</button>
            </form>
        </div>
    )
}
