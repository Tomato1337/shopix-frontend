import { FC, InputHTMLAttributes } from 'react'
import styles from './style.module.scss'

export const Search: FC<InputHTMLAttributes<HTMLInputElement>> = ({
    ...props
}) => {
    return (
        <div className={styles.search}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="29"
                height="29"
                viewBox="0 0 29 29"
                fill="none"
            >
                <path
                    d="M18.0328 17.1693C19.078 15.9025 19.7381 14.2777 19.7381 12.4876C19.7381 8.46681 16.4649 5.1896 12.4491 5.1896C8.43328 5.1896 5.1601 8.46681 5.1601 12.4876C5.1601 16.5084 8.43328 19.7856 12.4491 19.7856C14.2095 19.7856 15.8598 19.1522 17.1251 18.0781L22.7913 23.7513C22.9288 23.889 23.0938 23.9441 23.2589 23.9441C23.4239 23.9441 23.5889 23.889 23.7265 23.7513C23.974 23.5034 23.974 23.0628 23.7265 22.8149L18.0328 17.1693ZM12.4216 18.4637C9.12092 18.4637 6.45286 15.7923 6.45286 12.4876C6.45286 9.18284 9.12092 6.5115 12.4216 6.5115C15.7223 6.5115 18.3903 9.18284 18.3903 12.4876C18.3903 15.7923 15.7223 18.4637 12.4216 18.4637Z"
                    fill="white"
                />
            </svg>
            <input
                {...props}
                type="text"
                placeholder="Поиск..."
                className={styles.input}
                name={'search'}
            />
        </div>
    )
}
