import { getTokenManager } from "../auth/middleware";

// ideally have a singleton class and put all functions inside that
export async function getRate(request: any) {
    const token = await getTokenManager().getToken();
    const response = await fetch(
        "url-to-get-rates",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(request),
        }
    );
    if (!response.ok) {
        throw new Error(`UPS API error: ${response.status}`);
    }
    return await response.json();
}

