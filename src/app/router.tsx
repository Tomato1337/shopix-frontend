import { createHashRouter } from 'react-router-dom'
import { Home } from '@/pages/home'
import { LayoutHeader } from '@/widgets/header'
import { paths } from '@/shared/config/routers'
import { Layout } from '@/shared/ui/layout'

export const router = createHashRouter([
    {
        path: paths.home,
        element: <Layout layoutHeader={<LayoutHeader />} />,
        children: [
            { path: '', element: <Home /> },
            { path: paths.chats, element: <h2>chats</h2> },
        ],
    },
])
