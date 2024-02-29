"use server"

const { revalidatePath } = require("next/cache");

export const getUrlRedirect = async () => {
    const res = await fetch(`${process.env.API_URL}/auth/google`);
    const data = await res.json();

    revalidatePath('/login');
    return { data }
}

export const getUsers = async (dataAction) => {
    const res = await fetch(`${process.env.API_URL}/users`, {
        headers: {
            "Authorization": `Bearer ${ dataAction.token }`,
        }
    });
    const data = await res.json();

    revalidatePath('/');
    return { data, }
}

export const getUser = async (dataAction) => {
    const res = await fetch(`${process.env.API_URL}/users/${dataAction.id}`, {
        headers: {
            "Authorization": `Bearer ${ dataAction.token }`,
        }
    });
    const data = await res.json();

    revalidatePath(`/users/${ dataAction.id }`);
    revalidatePath(`/users/edit/${ dataAction.id }`);
    return { data }
}

export const deleteUser = async (dataAction) => {
    const res = await fetch(`${process.env.API_URL}/users/delete/${dataAction.id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${ dataAction.token }`,
        }
    });

    revalidatePath('/');
}

export const editUser = async (dataAction) => {
    const { id, name, token } = dataAction;

    const res = await fetch(`${process.env.API_URL}/users/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
    });

    const data = await res.json();

    revalidatePath('/');
    return { data };
}