import cn from 'classnames'
import { FC, HTMLAttributes, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ReviewsCard, useGetMe, useInfo } from '@/entities/reviews-card'
import { paths } from '@/shared/config/router'
import { ReviewsUserSkeleton } from '@/shared/ui/skeleton'
import styles from './styles.module.scss'

interface PopupProps extends HTMLAttributes<HTMLDivElement> {
    setUsername: (arg: string) => void
    isPopup: boolean
    setIsPopup: (arg: boolean) => void
}

export const Popup: FC<PopupProps> = ({
    setUsername,
    isPopup,
    setIsPopup,
    className,
}) => {
    const navigate = useNavigate()
    const popupRef = useRef<HTMLDivElement | null>(null)
    const setImage = useInfo((state) => state.setImage)
    const { data, isError, isLoading, error } = useGetMe()

    const exit = () => {
        localStorage.removeItem('token')
        setImage('')
        setUsername('Guest')
        navigate(paths.auth)
    }

    useEffect(() => {
        if (!isError && !isLoading && data) {
            setUsername(data?.username)
        }
    }, [isError, isLoading, setUsername, data])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node)
            ) {
                setIsPopup(false)
            }
        }

        if (isPopup) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isPopup, setIsPopup])

    return (
        <div
            ref={popupRef}
            className={cn(styles.popup, className)}
            style={{ display: isPopup ? 'block' : 'none' }}
        >
            <div className={styles.card}>
                {isLoading ? (
                    <ReviewsUserSkeleton />
                ) : isError ? (
                    error?.message
                ) : (
                    <ReviewsCard
                        username={data?.username || 'Guest'}
                        stars={data?.rating || 0}
                        image={data?.avatar || ''}
                        userId={data?.id || null}
                    />
                )}
            </div>
            <hr />
            <ul className={styles.info}>
                <li>Мои отзывы</li>
                <li>
                    <Link
                        onClick={() => setIsPopup(false)}
                        className={styles.link}
                        to={paths.myProduct}
                    >
                        Мои объявления
                    </Link>
                </li>
                <li>
                    <Link
                        onClick={() => setIsPopup(false)}
                        to={paths.favorites}
                        className={styles.link}
                    >
                        Избранное
                    </Link>
                </li>
                <li>Мои чаты</li>
            </ul>
            <hr />
            <ul className={styles.info}>
                <li>
                    <Link
                        // поправить на {`${paths.profile}/${data?.id}`} или что-то подобное
                        to={`profile/${data?.id}`}
                        className={styles.link}
                    >
                        Настройки
                    </Link>
                </li>
                <li onClick={exit} className={styles.exit}>
                    Выйти
                </li>
            </ul>
        </div>
    )
}
