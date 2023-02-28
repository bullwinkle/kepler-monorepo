export function messageId(): { id: string } {
    return { id: createUUID() };
}

export function createUUID (){
    return crypto.randomUUID();
}
