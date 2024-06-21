type Contact = {
    name: string,
    email: string,
    phone: string
}

type Status = {
    name: string,
    color: string
}

type Lead = {
    "id": number,
    "name": string,
    "price": number,
    "responsible": string,
    "status": Status,
    "date": number,
    "contacts": Contact[]
}

export { Contact, Status, Lead }