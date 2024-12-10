import { Channel } from "./types";

export async function getChannels(): Promise<Channel[]> {
    const request = await fetch("http://localhost:8000/api/channels");
    const data: Channel[] = await request.json();

    return data;
}

export async function addChannel(name?: string, number?: string): Promise<any> {
    if (!name || !number) {
        return;
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
