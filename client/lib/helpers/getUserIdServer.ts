import { cookies } from "next/headers";

export const getUserId = async () => {
    const cookieStore = await cookies();
    return cookieStore.get("userId")?.value || null;
};
