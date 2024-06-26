// import { useQuery } from '@tanstack/react-query'
// import { Request } from '@/shared/api'

// export const useGetMyProducts = () => {
//     const { data, isLoading, isError, error } = useQuery({
//         queryKey: ['me/products'],
//         queryFn: async () => {
//             const result = await Request.getWithToken('users/me/posts/')
//             return result
//         },
//     })
//     return {
//         data,
//         isLoading,
//         error,
//         isError,
//     }
// }

import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import { IProductResponse } from '@/entities/product-card'
import { Request } from '@/shared/api'

export const useGetMyProducts = (type: string) => {
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        isError,
        refetch,
        status,
    } = useInfiniteQuery<IProductResponse>({
        queryKey: ['me/posts/', type],
        queryFn: async ({ pageParam }) => {
            console.log(pageParam)
            const emptyProducts = {
                count: 0,
                next: '',
                previous: '',
                results: [],
            }

            const result = await Request.getWithToken<IProductResponse>(
                'users/me/posts/',
                {
                    params: {
                        page: `${pageParam}`,
                        status: type,
                    },
                },
            )
            if (result) {
                return result
            }

            return emptyProducts
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.next?.split('?page=')[1]

            return nextPage
        },
    })
    return {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        refetch,
        status,
        isError,
    }
}

export const useUpdateProduct = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (values: { status: string; id: number }) => {
            console.log(values)
            const result = await Request.putWithToken(`posts/${values.id}/`, {
                post: JSON.stringify(values),
            })
            return result
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['me/posts/', 'active'] })
            queryClient.invalidateQueries({
                queryKey: ['me/posts/', 'inactive'],
            })
        },
    })
    return mutation
}

export const useDeleteProduct = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (id: number) => {
            const result = await Request.deleteWithToken(`posts/${id}/`)
            return result
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['me/posts/', 'active'] })
            queryClient.invalidateQueries({
                queryKey: ['me/posts/', 'inactive'],
            })
        },
    })
    return mutation
}
