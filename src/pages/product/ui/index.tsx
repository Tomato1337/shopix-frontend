import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Skeleton from 'react-loading-skeleton'
import { useParams } from 'react-router-dom'
import { SingleValue } from 'react-select'
import { ImageSlider } from '@/widgets/image-slider'
import {
    FavoriteIcon,
    useAddFavorite,
    useRemoveFavorite,
} from '@/features/card/favorites'
import { useGetCategories } from '@/features/products/filters'
import { ReviewsCard, useGetUsers } from '@/entities/reviews-card'
import { SERVER_API } from '@/shared/config/constants'
import { formatPrice } from '@/shared/lib'
import { Button } from '@/shared/ui/button'
import { Select } from '@/shared/ui/select'
import { ReviewsCardSkeleton } from '@/shared/ui/skeleton'
import { useGetProduct, useUpdateProduct } from '../api'
import { IEditProduct } from '../model'
import styles from './styles.module.scss'

export const ProductPage = () => {
    const { id } = useParams()
    const mutationUpdate = useUpdateProduct(id || '')
    const { data, isError, isLoading } = useGetProduct(id || '')
    const [titleValue, setTitleValue] = useState<string>('')
    const [priceValue, setPriceValue] = useState<string>('')
    const [descriptionValue, setDescriptionValue] = useState('')
    const mutationAddFavorite = useAddFavorite(id || '')
    const mutationRemoveFavorite = useRemoveFavorite(id || '')
    const [pickCategory, setPickCategory] = useState<
        | {
              value: number
              label: string
          }
        | undefined
    >(undefined)
    const [images, setImages] = useState<(string | File)[]>([])
    const [isChange, setIsChange] = useState(false)
    const { data: categories, isError: isErrorCategories } = useGetCategories()
    const {
        data: user,
        isError: isErrorUser,
        isLoading: isLoadingUser,
    } = useGetUsers(data?.post.user || 0)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IEditProduct>({
        defaultValues: {
            title: data?.post.title,
            price: data?.post.price,
            category: data?.post.category,
            description: data?.post.description,
            images: data?.images,
        },
    })

    useEffect(() => {
        if (data) {
            const imagesFilter = data?.images?.map(
                (image: { image: string }) => `${SERVER_API}${image.image}`,
            )
            setImages(imagesFilter)
            setTitleValue(data.post.title)
            setPriceValue(+data.post.price + ' ₽')
            setPickCategory(
                categories?.find((item) => item.value === data?.post.category),
            )
            setDescriptionValue(data.post.description)
        }
    }, [data, categories])

    useEffect(() => {
        register('category', {
            required:
                !pickCategory && isChange
                    ? { value: true, message: 'Это поле обязательное' }
                    : undefined,
        })
    }, [pickCategory, register, isChange])

    useEffect(() => {
        register('title', {
            required:
                !titleValue && isChange
                    ? { value: true, message: 'Это поле обязательное' }
                    : undefined,
        })
    }, [titleValue, register, isChange])

    useEffect(() => {
        register('price', {
            required:
                !priceValue && isChange
                    ? { value: true, message: 'Это поле обязательное' }
                    : undefined,
        })
    }, [priceValue, register, isChange])

    useEffect(() => {
        register('description', {
            required:
                !descriptionValue && isChange
                    ? { value: true, message: 'Это поле обязательное' }
                    : undefined,
        })
    }, [descriptionValue, register, isChange])

    useEffect(() => {
        register('images', {
            required:
                !images && isChange
                    ? { value: true, message: 'Это поле обязательное' }
                    : undefined,
        })
    }, [images, register, isChange])

    useEffect(() => {
        if (mutationUpdate.isSuccess && isChange) {
            mutationUpdate.reset()
            setIsChange(false)
            setPriceValue((state) => {
                return state.replace(/₽/gi, '') + ' ₽'
            })
        }
    }, [mutationUpdate, isChange])

    // if (isLoading || isLoadingCategories) return <p>Загрузка...</p>
    if (isError || isErrorCategories) return <p>Ошибка загрузки</p>

    const category = categories?.find(
        (item) => item.value === data?.post.category,
    )

    const handleAddFavorite = () => {
        if (data) {
            if (data.post.is_favorite) {
                mutationRemoveFavorite.mutate(data.post.id)
            } else {
                mutationAddFavorite.mutate(data.post.id)
            }
        }
    }

    const handleChangePost = () => {
        if (isChange) {
            setPriceValue(priceValue)
            Promise.all(
                images.map((item) => {
                    if (typeof item === 'string') {
                        const name = item.split('/')[item.split('/').length - 1]
                        return fetch(item)
                            .then((response) => response.blob())
                            .then((blob) => {
                                return new File([blob], name, {
                                    type: blob.type,
                                })
                            })
                            .catch((error) => console.error(error))
                    } else {
                        return item
                    }
                }),
            ).then((images) => {
                // console.log(images)
                const formatedData = {
                    title: titleValue,
                    price: parseInt(priceValue.replace(/\D/gi, '')),
                    description: descriptionValue,
                    category: pickCategory?.value,
                }

                const formData = new FormData()
                formData.append('post', JSON.stringify(formatedData))

                images.forEach((img) => {
                    //@ts-expect-error Я не понимаю, как это типизировать, помогите
                    formData.append('images', img)
                })

                //@ts-expect-error Я не понимаю, как это типизировать, помогите
                mutationUpdate.mutate(formData)
                // setIsChange(false)
                // setPriceValue((state) => {
                //     return state.replace(/₽/gi, '') + ' ₽'
                // })
            })
        } else {
            setIsChange(true)
        }
    }

    console.log('rerender')
    console.log(errors.title)

    const pageVariants = {
        initial: { opacity: 0, scale: 0.6 },
        in: { opacity: 1, scale: 1 },
        out: { opacity: 0, scale: 0.6 },
    }
    console.log(isLoading)

    return (
        <AnimatePresence>
            <motion.div
                className={styles.product}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={{
                    type: 'spring',
                    ease: 'anticipate',
                    duration: 0.5,
                }}
            >
                <ImageSlider
                    images={images}
                    isChange={isChange}
                    setImages={setImages}
                    isLoading={isLoading}
                    errorMessage={errors.images?.message || ''}
                />
                <form className={styles.about}>
                    {errors.images?.message}
                    <h1 className={styles.title}>
                        {!isChange ? (
                            <div
                                className={classNames(styles.title, {
                                    [styles.change]: isChange,
                                })}
                            >
                                {isLoading ? (
                                    <Skeleton
                                        baseColor="var(--second-primary)"
                                        borderRadius={'16px'}
                                    />
                                ) : (
                                    titleValue
                                )}
                            </div>
                        ) : (
                            <input
                                className={classNames(styles.title, {
                                    [styles.change]: isChange,
                                })}
                                type="text"
                                value={titleValue}
                                onChange={(e) => {
                                    setTitleValue(e.target.value)
                                }}
                                disabled={!isChange}
                            />
                        )}
                        {errors.title?.message}
                    </h1>
                    <h2 className={styles.price}>
                        {isChange ? (
                            <input
                                className={classNames(styles.price, {
                                    [styles.change]: isChange,
                                })}
                                type="text"
                                value={priceValue}
                                onChange={(e) => {
                                    const value = e.target.value.replace(
                                        /\D/g,
                                        '',
                                    )
                                    setPriceValue(value)
                                }}
                                placeholder={formatPrice(
                                    parseInt(data?.post?.price || ''),
                                )}
                                disabled={!isChange}
                                // {...register('price', {
                                //     required: isChange
                                //         ? 'Это поле обязательное'
                                //         : false,
                                // })}
                            />
                        ) : (
                            <div className={styles.price}>
                                {isLoading ? (
                                    <Skeleton
                                        baseColor="var(--second-primary)"
                                        borderRadius={'16px'}
                                        width={'25%'}
                                    />
                                ) : (
                                    formatPrice(
                                        parseInt(data?.post?.price || ''),
                                    )
                                )}
                            </div>
                        )}
                        {errors.price?.message}
                    </h2>

                    {isChange ? (
                        <Select
                            options={categories}
                            className={styles.select}
                            onChange={(
                                newValue: SingleValue<{
                                    value: number
                                    label: string
                                }>,
                            ) => {
                                console.log(newValue)
                                setPickCategory(newValue || undefined)
                            }}
                            value={pickCategory}
                            // placeholder={category?.label || ''}
                            // value={data?.post.category}
                        />
                    ) : isLoading ? (
                        <Skeleton
                            baseColor="var(--second-primary)"
                            borderRadius={'16px'}
                            height={'32px'}
                            width={'100%'}
                        />
                    ) : (
                        <Select
                            placeholder={category?.label || ''}
                            value={data?.post.category}
                            className={styles.select}
                            isSearchable={false}
                            isDisabled={!isChange}
                        />
                    )}
                    {errors.category?.message}

                    <div className={styles['wrapper-area']}>
                        {isLoading ? (
                            <Skeleton
                                count={16}
                                baseColor="var(--second-primary)"
                                borderRadius={'16px'}
                            />
                        ) : (
                            <textarea
                                placeholder={data?.post.description}
                                {...(isChange
                                    ? { disabled: false }
                                    : { disabled: true })}
                                className={classNames(styles.area, {
                                    [styles.change]: isChange,
                                })}
                                value={descriptionValue}
                                onChange={(e) => {
                                    setDescriptionValue(e.target.value)
                                }}
                            />
                        )}
                    </div>

                    {errors.description?.message}

                    <div className={styles.info}>
                        {/* <ReviewsCard /> */}
                        <div className={styles.user}>
                            {isLoadingUser ? (
                                <ReviewsCardSkeleton />
                            ) : isErrorUser ? (
                                <p>Ошибка</p>
                            ) : (
                                <ReviewsCard
                                    username={user?.username || ''}
                                    image={
                                        user?.avatar
                                            ? SERVER_API + user.avatar
                                            : null
                                    }
                                    userId={user?.id || null}
                                    stars={user?.rating || 0}
                                />
                            )}
                        </div>
                        <div className={styles.address}>
                            <p>
                                {isLoading ? (
                                    <Skeleton
                                        baseColor="var(--second-primary)"
                                        borderRadius={'16px'}
                                    />
                                ) : (
                                    data?.post.address
                                )}
                            </p>
                            <div className={styles.view}>
                                <div className={styles.time}>
                                    {isLoading ? (
                                        <Skeleton
                                            width={'100%'}
                                            baseColor="var(--second-primary)"
                                            borderRadius={'16px'}
                                        />
                                    ) : (
                                        new Date(
                                            data?.post.created_at || '',
                                        ).toLocaleDateString()
                                    )}
                                </div>
                                <div
                                    className={styles.views}
                                    style={{
                                        display: isLoading ? 'block' : 'flex',
                                    }}
                                >
                                    {isLoading ? (
                                        <Skeleton
                                            baseColor="var(--second-primary)"
                                            borderRadius={'16px'}
                                            // width={'100%'}
                                        />
                                    ) : (
                                        <>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                            >
                                                <path
                                                    d="M15.47 7.83C14.882 6.30882 13.861 4.99331 12.5334 4.04604C11.2058 3.09878 9.62977 2.56129 8.00003 2.5C6.37029 2.56129 4.79423 3.09878 3.46663 4.04604C2.13904 4.99331 1.11811 6.30882 0.530031 7.83C0.490315 7.93985 0.490315 8.06015 0.530031 8.17C1.11811 9.69118 2.13904 11.0067 3.46663 11.954C4.79423 12.9012 6.37029 13.4387 8.00003 13.5C9.62977 13.4387 11.2058 12.9012 12.5334 11.954C13.861 11.0067 14.882 9.69118 15.47 8.17C15.5097 8.06015 15.5097 7.93985 15.47 7.83ZM8.00003 12.5C5.35003 12.5 2.55003 10.535 1.53503 8C2.55003 5.465 5.35003 3.5 8.00003 3.5C10.65 3.5 13.45 5.465 14.465 8C13.45 10.535 10.65 12.5 8.00003 12.5Z"
                                                    fill="black"
                                                />
                                                <mask
                                                    id="path-2-inside-1_224_1976"
                                                    fill="white"
                                                >
                                                    <path d="M8 5C7.40666 5 6.82664 5.17595 6.33329 5.50559C5.83994 5.83524 5.45543 6.30377 5.22836 6.85195C5.0013 7.40013 4.94189 8.00333 5.05765 8.58527C5.1734 9.16721 5.45912 9.70176 5.87868 10.1213C6.29824 10.5409 6.83279 10.8266 7.41473 10.9424C7.99667 11.0581 8.59987 10.9987 9.14805 10.7716C9.69623 10.5446 10.1648 10.1601 10.4944 9.66671C10.8241 9.17336 11 8.59334 11 8C11 7.20435 10.6839 6.44129 10.1213 5.87868C9.55871 5.31607 8.79565 5 8 5ZM8 10C7.60444 10 7.21776 9.8827 6.88886 9.66294C6.55996 9.44318 6.30362 9.13082 6.15224 8.76537C6.00087 8.39991 5.96126 7.99778 6.03843 7.60982C6.1156 7.22186 6.30608 6.86549 6.58579 6.58579C6.86549 6.30608 7.22186 6.1156 7.60982 6.03843C7.99778 5.96126 8.39992 6.00087 8.76537 6.15224C9.13082 6.30362 9.44318 6.55996 9.66294 6.88886C9.8827 7.21776 10 7.60444 10 8C10 8.53043 9.78929 9.03914 9.41421 9.41421C9.03914 9.78929 8.53043 10 8 10Z" />
                                                </mask>
                                                <path
                                                    d="M8 5C7.40666 5 6.82664 5.17595 6.33329 5.50559C5.83994 5.83524 5.45543 6.30377 5.22836 6.85195C5.0013 7.40013 4.94189 8.00333 5.05765 8.58527C5.1734 9.16721 5.45912 9.70176 5.87868 10.1213C6.29824 10.5409 6.83279 10.8266 7.41473 10.9424C7.99667 11.0581 8.59987 10.9987 9.14805 10.7716C9.69623 10.5446 10.1648 10.1601 10.4944 9.66671C10.8241 9.17336 11 8.59334 11 8C11 7.20435 10.6839 6.44129 10.1213 5.87868C9.55871 5.31607 8.79565 5 8 5ZM8 10C7.60444 10 7.21776 9.8827 6.88886 9.66294C6.55996 9.44318 6.30362 9.13082 6.15224 8.76537C6.00087 8.39991 5.96126 7.99778 6.03843 7.60982C6.1156 7.22186 6.30608 6.86549 6.58579 6.58579C6.86549 6.30608 7.22186 6.1156 7.60982 6.03843C7.99778 5.96126 8.39992 6.00087 8.76537 6.15224C9.13082 6.30362 9.44318 6.55996 9.66294 6.88886C9.8827 7.21776 10 7.60444 10 8C10 8.53043 9.78929 9.03914 9.41421 9.41421C9.03914 9.78929 8.53043 10 8 10Z"
                                                    fill="black"
                                                />
                                                <path
                                                    d="M11 8H16H11ZM8 0C6.41775 0 4.87103 0.469193 3.55544 1.34824L9.11114 9.66294C8.78224 9.8827 8.39556 10 8 10V0ZM3.55544 1.34824C2.23985 2.22729 1.21447 3.47672 0.608965 4.93853L9.84776 8.76537C9.69639 9.13082 9.44004 9.44318 9.11114 9.66294L3.55544 1.34824ZM0.608965 4.93853C0.00346422 6.40034 -0.154963 8.00887 0.153719 9.56072L9.96157 7.60982C10.0387 7.99778 9.99914 8.39991 9.84776 8.76537L0.608965 4.93853ZM0.153719 9.56072C0.4624 11.1126 1.22433 12.538 2.34315 13.6569L9.41421 6.58579C9.69392 6.86549 9.8844 7.22186 9.96157 7.60982L0.153719 9.56072ZM2.34315 13.6569C3.46197 14.7757 4.88743 15.5376 6.43928 15.8463L8.39018 6.03843C8.77814 6.1156 9.13451 6.30608 9.41421 6.58579L2.34315 13.6569ZM6.43928 15.8463C7.99113 16.155 9.59966 15.9965 11.0615 15.391L7.23463 6.15224C7.60009 6.00087 8.00222 5.96126 8.39018 6.03843L6.43928 15.8463ZM11.0615 15.391C12.5233 14.7855 13.7727 13.7602 14.6518 12.4446L6.33706 6.88886C6.55682 6.55996 6.86918 6.30362 7.23463 6.15224L11.0615 15.391ZM14.6518 12.4446C15.5308 11.129 16 9.58225 16 8H6C6 7.60444 6.1173 7.21776 6.33706 6.88886L14.6518 12.4446ZM16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315L6.58579 9.41421C6.21071 9.03914 6 8.53043 6 8H16ZM13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0V10C7.46957 10 6.96086 9.78929 6.58579 9.41421L13.6569 2.34315ZM8 5C8.59335 5 9.17337 5.17595 9.66671 5.50559L4.11101 13.8203C5.26215 14.5895 6.61553 15 8 15V5ZM9.66671 5.50559C10.1601 5.83523 10.5446 6.30377 10.7716 6.85195L1.53284 10.6788C2.06266 11.9579 2.95987 13.0511 4.11101 13.8203L9.66671 5.50559ZM10.7716 6.85195C10.9987 7.40013 11.0581 8.00333 10.9424 8.58527L1.1345 6.63437C0.864408 7.99224 1.00303 9.3997 1.53284 10.6788L10.7716 6.85195ZM10.9424 8.58527C10.8266 9.16721 10.5409 9.70176 10.1213 10.1213L3.05025 3.05025C2.07129 4.02922 1.4046 5.2765 1.1345 6.63437L10.9424 8.58527ZM10.1213 10.1213C9.70176 10.5409 9.16722 10.8266 8.58527 10.9424L6.63437 1.1345C5.2765 1.4046 4.02922 2.07129 3.05025 3.05025L10.1213 10.1213ZM8.58527 10.9424C8.00333 11.0581 7.40013 10.9987 6.85195 10.7716L10.6788 1.53284C9.3997 1.00303 7.99224 0.864406 6.63437 1.1345L8.58527 10.9424ZM6.85195 10.7716C6.30377 10.5446 5.83523 10.1601 5.50559 9.66671L13.8203 4.11101C13.0511 2.95987 11.9579 2.06266 10.6788 1.53284L6.85195 10.7716ZM5.50559 9.66671C5.17595 9.17337 5 8.59335 5 8H15C15 6.61553 14.5895 5.26215 13.8203 4.11101L5.50559 9.66671ZM5 8C5 7.20435 5.31607 6.44129 5.87868 5.87868L12.9497 12.9497C14.2625 11.637 15 9.85652 15 8H5ZM5.87868 5.87868C6.44129 5.31607 7.20435 5 8 5V15C9.85652 15 11.637 14.2625 12.9497 12.9497L5.87868 5.87868Z"
                                                    fill="#00BAFF"
                                                    mask="url(#path-2-inside-1_224_1976)"
                                                />
                                            </svg>
                                            {data?.post.views}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.action}>
                        {data?.post.is_owner ? (
                            <>
                                <Button
                                    type="submit"
                                    onClick={handleSubmit(handleChangePost)}
                                    className={styles.button}
                                    size="big"
                                >
                                    {isChange ? 'СОХРАНИТЬ' : 'ИЗМЕНИТЬ'}
                                </Button>
                                {isChange ? (
                                    <Button
                                        onClick={() => {
                                            setIsChange(false)
                                            setPriceValue(
                                                formatPrice(
                                                    parseInt(
                                                        data?.post.price || '',
                                                    ),
                                                ),
                                            )
                                        }}
                                        className={classNames(
                                            styles.button,
                                            styles['button-cancel'],
                                        )}
                                        size="big"
                                    >
                                        ОТМЕНИТЬ
                                    </Button>
                                ) : null}
                            </>
                        ) : (
                            <Button
                                onClick={(e) => e.preventDefault()}
                                className={styles.button}
                                size="big"
                            >
                                НАПИСАТЬ
                            </Button>
                        )}
                        {!data?.post.is_owner ? (
                            <FavoriteIcon
                                onClick={handleAddFavorite}
                                isFavorite={data?.post.is_favorite || false}
                            />
                        ) : null}
                        <div className={styles.status}>
                            {data?.post.status === 'active' ? (
                                <p className={styles.active}>Активное</p>
                            ) : (
                                <p className={styles.inactive}>Неактивное</p>
                            )}
                        </div>
                        {mutationUpdate.isError && (
                            <p className={styles.error}>
                                Произошла ошибка при обновлении{' '}
                                {mutationUpdate.error.message}
                            </p>
                        )}
                        {mutationUpdate.isPending && (
                            <p className={styles.loading}>Загрузка...</p>
                        )}
                    </div>
                </form>
            </motion.div>
        </AnimatePresence>
    )
}
