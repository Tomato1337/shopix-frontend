import { Fragment } from 'react/jsx-runtime'
import InfiniteScroll from 'react-infinite-scroll-component'
import { v4 as uuidv4 } from 'uuid'
import { MoreIcon } from '@/entities/more'
import { IProduct, ProductCard } from '@/entities/product-card'
import { EmptyElement } from '@/shared/ui/empty'
import { ErrorElement } from '@/shared/ui/error'
import { ProductCardSkeleton } from '@/shared/ui/skeleton'
import { useGetMyProducts, useUpdateProduct } from '..'
import styles from './styles.module.scss'

export const MyProducts = ({ type }: { type: string }) => {
    const {
        data,
        fetchNextPage,
        isError,
        hasNextPage,
        isFetchingNextPage,
        error,
        isFetching,
    } = useGetMyProducts(type)
    const mutation = useUpdateProduct()

    const isEmpty = data?.pages[0].results.length === 0

    if (isEmpty && !isFetching) {
        return <EmptyElement className={styles.empty} />
    }

    if (isError) {
        return (
            <ErrorElement
                className={styles.error}
                message={error?.message || ''}
            />
        )
    }
    console.log(type)

    return (
        <>
            <InfiniteScroll
                dataLength={data?.pages.length || 0}
                next={fetchNextPage}
                loader={<></>}
                className={styles.products}
                style={
                    !isEmpty
                        ? {
                              display: 'grid',
                              gridTemplateColumns:
                                  'repeat(auto-fill, minmax(283px, 1fr))',
                              gap: '20px',
                          }
                        : { display: 'block' }
                }
                hasMore={hasNextPage || false}
            >
                {data?.pages.map((item) => (
                    <Fragment key={uuidv4()}>
                        {item.results.map((product: IProduct) => (
                            <ProductCard
                                className={
                                    type === 'inactive' ? styles.inactive : ''
                                }
                                action={
                                    type === 'active' ? (
                                        <MoreIcon
                                            actions={
                                                <ul>
                                                    <li
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                            const obj = {
                                                                post: {
                                                                    title: product.title,
                                                                    id: product.id,
                                                                    status: 'inactive',
                                                                },
                                                            }
                                                            mutation.mutate(obj)
                                                        }}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 16 17"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M15.47 8.16008C14.882 6.6389 13.861 5.32339 12.5334 4.37612C11.2058 3.42886 9.62977 2.89136 8.00003 2.83008C6.37029 2.89136 4.79423 3.42886 3.46663 4.37612C2.13904 5.32339 1.11811 6.6389 0.530031 8.16008C0.490315 8.26993 0.490315 8.39022 0.530031 8.50008C1.11811 10.0213 2.13904 11.3368 3.46663 12.284C4.79423 13.2313 6.37029 13.7688 8.00003 13.8301C9.62977 13.7688 11.2058 13.2313 12.5334 12.284C13.861 11.3368 14.882 10.0213 15.47 8.50008C15.5097 8.39022 15.5097 8.26993 15.47 8.16008ZM8.00003 12.8301C5.35003 12.8301 2.55003 10.8651 1.53503 8.33008C2.55003 5.79508 5.35003 3.83008 8.00003 3.83008C10.65 3.83008 13.45 5.79508 14.465 8.33008C13.45 10.8651 10.65 12.8301 8.00003 12.8301Z"
                                                                fill="white"
                                                            />
                                                            <mask
                                                                id="path-2-inside-1_224_171"
                                                                fill="white"
                                                            >
                                                                <path d="M8 5.33008C7.40666 5.33008 6.82664 5.50603 6.33329 5.83567C5.83994 6.16531 5.45543 6.63385 5.22836 7.18203C5.0013 7.73021 4.94189 8.33341 5.05765 8.91535C5.1734 9.49729 5.45912 10.0318 5.87868 10.4514C6.29824 10.871 6.83279 11.1567 7.41473 11.2724C7.99667 11.3882 8.59987 11.3288 9.14805 11.1017C9.69623 10.8747 10.1648 10.4901 10.4944 9.99679C10.8241 9.50344 11 8.92342 11 8.33008C11 7.53443 10.6839 6.77137 10.1213 6.20876C9.55871 5.64615 8.79565 5.33008 8 5.33008ZM8 10.3301C7.60444 10.3301 7.21776 10.2128 6.88886 9.99302C6.55996 9.77325 6.30362 9.4609 6.15224 9.09544C6.00087 8.72999 5.96126 8.32786 6.03843 7.9399C6.1156 7.55194 6.30608 7.19557 6.58579 6.91586C6.86549 6.63616 7.22186 6.44568 7.60982 6.36851C7.99778 6.29134 8.39992 6.33094 8.76537 6.48232C9.13082 6.63369 9.44318 6.89004 9.66294 7.21894C9.8827 7.54784 10 7.93452 10 8.33008C10 8.86051 9.78929 9.36922 9.41421 9.74429C9.03914 10.1194 8.53043 10.3301 8 10.3301Z" />
                                                            </mask>
                                                            <path
                                                                d="M8 5.33008C7.40666 5.33008 6.82664 5.50603 6.33329 5.83567C5.83994 6.16531 5.45543 6.63385 5.22836 7.18203C5.0013 7.73021 4.94189 8.33341 5.05765 8.91535C5.1734 9.49729 5.45912 10.0318 5.87868 10.4514C6.29824 10.871 6.83279 11.1567 7.41473 11.2724C7.99667 11.3882 8.59987 11.3288 9.14805 11.1017C9.69623 10.8747 10.1648 10.4901 10.4944 9.99679C10.8241 9.50344 11 8.92342 11 8.33008C11 7.53443 10.6839 6.77137 10.1213 6.20876C9.55871 5.64615 8.79565 5.33008 8 5.33008ZM8 10.3301C7.60444 10.3301 7.21776 10.2128 6.88886 9.99302C6.55996 9.77325 6.30362 9.4609 6.15224 9.09544C6.00087 8.72999 5.96126 8.32786 6.03843 7.9399C6.1156 7.55194 6.30608 7.19557 6.58579 6.91586C6.86549 6.63616 7.22186 6.44568 7.60982 6.36851C7.99778 6.29134 8.39992 6.33094 8.76537 6.48232C9.13082 6.63369 9.44318 6.89004 9.66294 7.21894C9.8827 7.54784 10 7.93452 10 8.33008C10 8.86051 9.78929 9.36922 9.41421 9.74429C9.03914 10.1194 8.53043 10.3301 8 10.3301Z"
                                                                fill="white"
                                                            />
                                                            <path
                                                                d="M11 8.33008H16H11ZM8 0.330078C6.41775 0.330078 4.87103 0.799271 3.55544 1.67832L9.11114 9.99302C8.78224 10.2128 8.39556 10.3301 8 10.3301V0.330078ZM3.55544 1.67832C2.23985 2.55737 1.21447 3.8068 0.608965 5.26861L9.84776 9.09544C9.69639 9.4609 9.44004 9.77325 9.11114 9.99302L3.55544 1.67832ZM0.608965 5.26861C0.00346422 6.73042 -0.154963 8.33895 0.153719 9.8908L9.96157 7.9399C10.0387 8.32786 9.99914 8.72999 9.84776 9.09544L0.608965 5.26861ZM0.153719 9.8908C0.4624 11.4426 1.22433 12.8681 2.34315 13.9869L9.41421 6.91586C9.69392 7.19557 9.8844 7.55194 9.96157 7.9399L0.153719 9.8908ZM2.34315 13.9869C3.46197 15.1058 4.88743 15.8677 6.43928 16.1764L8.39018 6.36851C8.77814 6.44568 9.13451 6.63616 9.41421 6.91586L2.34315 13.9869ZM6.43928 16.1764C7.99113 16.485 9.59966 16.3266 11.0615 15.7211L7.23463 6.48232C7.60009 6.33094 8.00222 6.29134 8.39018 6.36851L6.43928 16.1764ZM11.0615 15.7211C12.5233 15.1156 13.7727 14.0902 14.6518 12.7746L6.33706 7.21894C6.55682 6.89004 6.86918 6.6337 7.23463 6.48232L11.0615 15.7211ZM14.6518 12.7746C15.5308 11.459 16 9.91233 16 8.33008H6C6 7.93451 6.1173 7.54784 6.33706 7.21894L14.6518 12.7746ZM16 8.33008C16 6.20835 15.1571 4.17352 13.6569 2.67322L6.58579 9.74429C6.21071 9.36922 6 8.86051 6 8.33008H16ZM13.6569 2.67322C12.1566 1.17293 10.1217 0.330078 8 0.330078V10.3301C7.46957 10.3301 6.96086 10.1194 6.58579 9.74429L13.6569 2.67322ZM8 5.33008C8.59335 5.33008 9.17337 5.50603 9.66671 5.83567L4.11101 14.1504C5.26215 14.9195 6.61553 15.3301 8 15.3301V5.33008ZM9.66671 5.83567C10.1601 6.16531 10.5446 6.63385 10.7716 7.18203L1.53284 11.0089C2.06266 12.2879 2.95987 13.3812 4.11101 14.1504L9.66671 5.83567ZM10.7716 7.18203C10.9987 7.73021 11.0581 8.33341 10.9424 8.91535L1.1345 6.96445C0.864408 8.32231 1.00303 9.72978 1.53284 11.0089L10.7716 7.18203ZM10.9424 8.91535C10.8266 9.49729 10.5409 10.0318 10.1213 10.4514L3.05025 3.38033C2.07129 4.3593 1.4046 5.60658 1.1345 6.96445L10.9424 8.91535ZM10.1213 10.4514C9.70176 10.871 9.16722 11.1567 8.58527 11.2724L6.63437 1.46458C5.2765 1.73468 4.02922 2.40136 3.05025 3.38033L10.1213 10.4514ZM8.58527 11.2724C8.00333 11.3882 7.40013 11.3288 6.85195 11.1017L10.6788 1.86292C9.3997 1.33311 7.99224 1.19448 6.63437 1.46458L8.58527 11.2724ZM6.85195 11.1017C6.30377 10.8747 5.83523 10.4901 5.50559 9.99679L13.8203 4.44109C13.0511 3.28995 11.9579 2.39274 10.6788 1.86292L6.85195 11.1017ZM5.50559 9.99679C5.17595 9.50344 5 8.92342 5 8.33008H15C15 6.94561 14.5895 5.59223 13.8203 4.44109L5.50559 9.99679ZM5 8.33008C5 7.53443 5.31607 6.77136 5.87868 6.20876L12.9497 13.2798C14.2625 11.9671 15 10.1866 15 8.33008H5ZM5.87868 6.20876C6.44129 5.64615 7.20435 5.33008 8 5.33008V15.3301C9.85652 15.3301 11.637 14.5926 12.9497 13.2798L5.87868 6.20876Z"
                                                                fill="white"
                                                                mask="url(#path-2-inside-1_224_171)"
                                                            />
                                                        </svg>
                                                        Скрыть объявление
                                                    </li>
                                                    <li>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 20 20"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M9.50018 15.1342L15.6635 8.97083C14.6266 8.5379 13.6848 7.90535 12.8918 7.10917C12.0953 6.31601 11.4625 5.37398 11.0293 4.33667L4.86601 10.5C4.38518 10.9808 4.14435 11.2217 3.93768 11.4867C3.6936 11.7994 3.48431 12.1378 3.31351 12.4958C3.16935 12.7992 3.06185 13.1225 2.84685 13.7675L1.71185 17.17C1.65961 17.3258 1.65186 17.4931 1.68947 17.653C1.72707 17.813 1.80855 17.9593 1.92474 18.0754C2.04093 18.1916 2.18722 18.2731 2.34717 18.3107C2.50712 18.3483 2.67439 18.3406 2.83018 18.2883L6.23268 17.1533C6.87851 16.9383 7.20101 16.8308 7.50434 16.6867C7.86268 16.5158 8.20101 16.3067 8.51351 16.0625C8.77851 15.8558 9.01934 15.615 9.50018 15.1342ZM17.3735 7.26083C17.988 6.64631 18.3333 5.81283 18.3333 4.94375C18.3333 4.07468 17.988 3.2412 17.3735 2.62667C16.759 2.01214 15.9255 1.6669 15.0564 1.6669C14.1874 1.6669 13.3539 2.01214 12.7393 2.62667L12.0002 3.36583L12.0318 3.45833C12.3961 4.5006 12.9922 5.44659 13.7752 6.225C14.5769 7.03142 15.556 7.63926 16.6343 8L17.3735 7.26083Z"
                                                                fill="white"
                                                            />
                                                        </svg>
                                                        Изменить объявление
                                                    </li>
                                                </ul>
                                            }
                                        />
                                    ) : null
                                }
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </Fragment>
                ))}
                {(isFetchingNextPage || (isFetching && !data)) &&
                    new Array(12).fill(0).map((_, i) => (
                        <ProductCard style={{ display: 'block' }} key={i}>
                            <ProductCardSkeleton />
                        </ProductCard>
                    ))}
            </InfiniteScroll>
        </>
    )

    // console.log(data?.results)
    // return (
    //     <div
    //         className={styles.products}
    //         style={{ display: data?.results?.length === 0 ? 'block' : 'grid' }}
    //     >
    //         {isLoading ? (
    //             new Array(6).fill(0).map((_, i) => (
    //                 <ProductCard style={{ display: 'block' }} key={i}>
    //                     <ProductCardSkeleton />
    //                 </ProductCard>
    //             ))
    //         ) : isError ? (
    //             <ErrorElement message={error?.message || ''} />
    //         ) : data?.results.length > 0 ? (
    //             data?.results.map((product: IProduct) => (
    //                 <ProductCard
    //                     action={
    //                         <MoreIcon
    //                             actions={
    //                                 <ul>
    //                                     <li>
    //                                         <svg
    //                                             xmlns="http://www.w3.org/2000/svg"
    //                                             width="24"
    //                                             height="20"
    //                                             viewBox="0 0 24 20"
    //                                             fill="none"
    //                                         >
    //                                             <path
    //                                                 d="M4.26074 5.83333H19.6774M10.042 9.16667V14.1667M13.8962 9.16667V14.1667M5.22428 5.83333L6.18783 15.8333C6.18783 16.2754 6.39086 16.6993 6.75225 17.0118C7.11365 17.3244 7.60381 17.5 8.11491 17.5H15.8232C16.3343 17.5 16.8245 17.3244 17.1859 17.0118C17.5473 16.6993 17.7503 16.2754 17.7503 15.8333L18.7139 5.83333M9.07845 5.83333V3.33333C9.07845 3.11232 9.17997 2.90036 9.36067 2.74408C9.54136 2.5878 9.78644 2.5 10.042 2.5H13.8962C14.1517 2.5 14.3968 2.5878 14.5775 2.74408C14.7582 2.90036 14.8597 3.11232 14.8597 3.33333V5.83333"
    //                                                 stroke="white"
    //                                                 strokeWidth="2"
    //                                                 strokeLinecap="round"
    //                                                 strokeLinejoin="round"
    //                                             />
    //                                         </svg>
    //                                         Удалить объявление
    //                                     </li>
    //                                     <li>
    //                                         <svg
    //                                             xmlns="http://www.w3.org/2000/svg"
    //                                             width="20"
    //                                             height="20"
    //                                             viewBox="0 0 20 20"
    //                                             fill="none"
    //                                         >
    //                                             <path
    //                                                 d="M9.50018 15.1342L15.6635 8.97083C14.6266 8.5379 13.6848 7.90535 12.8918 7.10917C12.0953 6.31601 11.4625 5.37398 11.0293 4.33667L4.86601 10.5C4.38518 10.9808 4.14435 11.2217 3.93768 11.4867C3.6936 11.7994 3.48431 12.1378 3.31351 12.4958C3.16935 12.7992 3.06185 13.1225 2.84685 13.7675L1.71185 17.17C1.65961 17.3258 1.65186 17.4931 1.68947 17.653C1.72707 17.813 1.80855 17.9593 1.92474 18.0754C2.04093 18.1916 2.18722 18.2731 2.34717 18.3107C2.50712 18.3483 2.67439 18.3406 2.83018 18.2883L6.23268 17.1533C6.87851 16.9383 7.20101 16.8308 7.50434 16.6867C7.86268 16.5158 8.20101 16.3067 8.51351 16.0625C8.77851 15.8558 9.01934 15.615 9.50018 15.1342ZM17.3735 7.26083C17.988 6.64631 18.3333 5.81283 18.3333 4.94375C18.3333 4.07468 17.988 3.2412 17.3735 2.62667C16.759 2.01214 15.9255 1.6669 15.0564 1.6669C14.1874 1.6669 13.3539 2.01214 12.7393 2.62667L12.0002 3.36583L12.0318 3.45833C12.3961 4.5006 12.9922 5.44659 13.7752 6.225C14.5769 7.03142 15.556 7.63926 16.6343 8L17.3735 7.26083Z"
    //                                                 fill="white"
    //                                             />
    //                                         </svg>
    //                                         Изменить объявление
    //                                     </li>
    //                                 </ul>
    //                             }
    //                         />
    //                     }
    //                     key={product.id}
    //                     product={product}
    //                 />
    //             ))
    //         ) : (
    //             <EmptyElement />
    //         )}
    //     </div>
    // )
}
