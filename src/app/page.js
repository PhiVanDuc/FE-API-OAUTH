"use client"

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { deleteUser, getUsers } from "@/actions/server-actions";
import { jwtDecode } from "jwt-decode";

export default function Home() {
    const router = useRouter();
    const [appearState, setAppearState] = useState(false);
    const [usersState, setUsersState] = useState();
    const tokenRef = useRef(Cookies.get("accessToken"));
    const currentUser = useRef();

    useEffect(() => {
        if (!Cookies.get("accessToken")) {
            setAppearState(false);
            router.push('/login');
        } else {
            (async () => {
                const { data } = await getUsers({ token: tokenRef.current });
                if (data.success) {
                    currentUser.current = jwtDecode(tokenRef.current);
                    setUsersState(data.data.users);
                } else {
                    Cookies.remove("accessToken");
                    router.push('/login');
                }
            })();
            setAppearState(true);
        }
    }, []);

    const handleClickDelete = async (id) => {
        await deleteUser({ id, token: tokenRef.current });

        if (id === currentUser.current.id) {
            Cookies.remove("accessToken");
            router.push('/login');
        }
    }

    const handleClickRedirectUpdate = (id) => {
        router.push(`/users/edit/${ id }`);
    }

    if (appearState) {
        return (
            <div className="container mx-a pt-5">
                <h1 className="fs-3 fw-bold mb-5">Home</h1>
    
                <h2 className="fs-5 fw-semibold mb-4">Profile dashboard</h2>
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th>
                                <input type="checkbox" />
                            </th>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Provider</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
    
                    <tbody>
                        {
                            usersState?.map((user, index) => {
                                return (
                                    <tr key={ user.id }>
                                        <td className="align-middle"><input type="checkbox" /></td>
                                        <td className="align-middle">{ index + 1 }</td>
                                        <td className="align-middle d-flex align-items-center">
                                            <img className="rounded me-2" style={{ width: "45px", height: "45px" }} src={ `${ user.thumbnail }` } alt="" />
                                            <div>
                                                <p className="mb-2">{ user.name }</p>
                                                {
                                                    currentUser.current.id === user.id && <p className="mb-0" style={{ fontSize: "12px" }}>Current user</p>
                                                }
                                            </div>
                                        </td>
                                        <td className="align-middle">{ user.Providers[0].provider }</td>
                                        <td className="align-middle">
                                            <a href={`/users/${user.id}`} className="btn">Detail</a>
                                            <button className="btn" onClick={ () => { handleClickRedirectUpdate(user.id) } }>Sửa</button>
                                            <button className="btn" onClick={ (e) => { e.target.closest("tr").remove(); handleClickDelete(user.id) } }>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}