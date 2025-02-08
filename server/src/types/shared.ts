

export type User = {
    id?: number
    email: string
    password?: string
    phone_number: string
    first_name: string
    last_name: string
    image: string
    subscription_start?: Date
    subscription_end?: Date
    remaining_rooms?: number
    country: string
    verification_token?: string
    credit:number
}
