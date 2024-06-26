import { useInfiniteQuery } from '@tanstack/react-query'
import { Request } from '@/shared/api'
import { IFavoriteProductResponse } from '../model'

export const useGetFavorites = () => {
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        refetch,
        status,
    } = useInfiniteQuery<IFavoriteProductResponse>({
        queryKey: ['posts/favorites'],
        queryFn: async ({ pageParam }) => {
            console.log(pageParam)
            const result = (await Request.getWithToken('posts/favorites/', {
                params: {
                    page: `${pageParam}`,
                },
            })) as IFavoriteProductResponse

            return result
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
    }
}
