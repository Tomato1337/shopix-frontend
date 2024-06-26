import { useQuery } from '@tanstack/react-query'
import { Request } from '@/shared/api'
import { useInfo } from '../model'

interface IUsers {
    email: string
    username: string
    rating: number
    full_name: string | null
    avatar: string | null
    created_at: string
    updated_at: string
    is_active: boolean
    id: string
}

export const useGetMe = () => {
    const setImage = useInfo((state) => state.setImage)

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const result = await Request.getWithToken<IUsers>('users/me')
            if (result?.avatar) {
                setImage(result.avatar)
            }
            return result
        },
    })
    return {
        data,
        isLoading,
        error,
        isError,
    }
}

export const useGetUsers = (id: number) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['users', id],
        queryFn: async () => {
            const result = await Request.get<IUsers>(`users/${id}`)
            return result
        },
    })
    return {
        data,
        isLoading,
        error,
        isError,
    }
}
