import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { router } from '../router'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

export const Providers = () => {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools />
                <RouterProvider router={router} />
            </QueryClientProvider>
        </>
    )
}
