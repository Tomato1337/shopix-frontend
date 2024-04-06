import axios, { AxiosError } from 'axios'
import { SERVER_API } from '../config/constants'
// interface RequestSettings {
//     params?: {}
// }
export class Request {
    static url: string = `${SERVER_API}/api/`

    static async get(
        url: string,
        params?: {
            headers?: {
                [key: string]: string
            }
            params?: {
                [key: string]: string
            }
        },
    ) {
        try {
            console.log(this.url + url, params)
            const response = await axios.get(this.url + url, params)
            return response.data
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.message)
            }
        }
    }

    static async post<T>(url: string, data: T) {
        try {
            const response = await axios.post<T>(this.url + url, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            return response.data
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error)
                throw new Error(error.message)
            }
        }
    }
}
