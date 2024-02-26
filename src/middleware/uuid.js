import { v4 as uuidv4 } from "uuid"

export const createUUID = () => {
    const id = uuidv4()
    return id
}
