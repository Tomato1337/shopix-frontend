import classNames from 'classnames'
import { FC, SVGProps } from 'react'
import styles from './styles.module.scss'

interface FavoriteIconProps extends SVGProps<SVGSVGElement> {
    isFavorite: boolean | undefined
}

export const FavoriteIcon: FC<FavoriteIconProps> = ({
    className,
    isFavorite,
    ...props
}) => {
    return (
        <svg
            className={classNames(styles.img, className)}
            xmlns="http://www.w3.org/2000/svg"
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            {...props}
        >
            <path
                className={isFavorite ? styles.active : ''}
                d="M22 39.1417L19.3417 36.7217C9.9 28.16 3.66667 22.495 3.66667 15.5833C3.66667 9.91833 8.10334 5.5 13.75 5.5C16.94 5.5 20.0017 6.985 22 9.31333C23.9983 6.985 27.06 5.5 30.25 5.5C35.8967 5.5 40.3333 9.91833 40.3333 15.5833C40.3333 22.495 34.1 28.16 24.6583 36.7217L22 39.1417Z"
                fill="#00668C"
            />
        </svg>
    )
}
