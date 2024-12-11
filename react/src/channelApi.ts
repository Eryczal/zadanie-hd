import { Channel, Response } from "./types";

export async function getChannels(): Promise<Channel[]> {
    const request = await fetch("http://localhost:8000/api/channels");
    const data: Channel[] = await request.json();

    return data;
}

export async function addChannel(
    name?: string,
    number?: string
): Promise<Channel> {
    if (!name || !number) {
        throw new Error("Brak danych.");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("number", number);

    const request = await fetch("http://localhost:8000/api/channels", {
        method: "POST",
        body: formData,
    });
    const data: Channel = await request.json();

    return data;
}

export async function editChannel(
    id: string,
    name?: string,
    number?: string
): Promise<Channel> {
    if (!id || !name || !number) {
        throw new Error("Brak danych.");
    }

    const request = await fetch(`http://localhost:8000/api/channels/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, number }),
    });

    if (!request.ok) {
        const error = await request.json();
        throw new Error(error.message || "Błąd przy edytowaniu.");
    }

    const data: Channel = await request.json();
    return data;
}

export async function deleteChannels(ids: number[]): Promise<Response> {
    if (!ids || ids.length === 0) {
        throw new Error("Brak danych.");
    }

    const request = await fetch("http://localhost:8000/api/channels", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
    });

    if (!request.ok) {
        const error = await request.json();
        throw new Error(error.error || "Błąd w usuwaniu danych.");
    }

    const response = await request.json();
    return response;
}
