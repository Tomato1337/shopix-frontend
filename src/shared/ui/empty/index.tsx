import classNames from 'classnames'
import { FC, HTMLAttributes } from 'react'
import styles from './styles.module.scss'

interface EmptyElementProps extends HTMLAttributes<HTMLDivElement> {
    color?: 'dark' | 'light'
}

export const EmptyElement: FC<EmptyElementProps> = ({
    color = 'dark',
    className,
    ...props
}) => {
    return (
        <div
            className={classNames(styles.empty, className)}
            style={{
                color: color === 'dark' ? 'var(--black)' : 'var(--white-color)',
            }}
            {...props}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="195"
                height="195"
                viewBox="0 0 195 195"
                fill="none"
            >
                <path
                    d="M97.5 0.40625C78.2967 0.40625 59.5246 6.1007 43.5576 16.7695C27.5907 27.4383 15.1459 42.6023 7.79712 60.3438C0.448319 78.0854 -1.47446 97.6077 2.27192 116.442C6.01831 135.276 15.2656 152.577 28.8444 166.156C42.4232 179.734 59.7237 188.982 78.558 192.728C97.3923 196.475 116.915 194.552 134.656 187.203C152.398 179.854 167.562 167.409 178.231 151.442C188.899 135.475 194.594 116.703 194.594 97.5C194.567 71.7575 184.328 47.0771 166.126 28.8744C147.923 10.6717 123.243 0.433435 97.5 0.40625ZM63.8907 67.625C66.1064 67.625 68.2724 68.2821 70.1148 69.5131C71.9571 70.7441 73.3931 72.4938 74.241 74.5409C75.0889 76.588 75.3108 78.8406 74.8785 81.0137C74.4463 83.1869 73.3793 85.1831 71.8125 86.7499C70.2457 88.3167 68.2495 89.3837 66.0763 89.816C63.9031 90.2483 61.6505 90.0264 59.6034 89.1785C57.5563 88.3305 55.8066 86.8946 54.5756 85.0522C53.3446 83.2099 52.6875 81.0439 52.6875 78.8281C52.6875 75.8569 53.8679 73.0073 55.9689 70.9063C58.0699 68.8053 60.9194 67.625 63.8907 67.625ZM138.578 148.773C136.864 149.762 134.828 150.03 132.917 149.519C131.005 149.008 129.375 147.759 128.383 146.047C121.409 133.994 110.449 127.375 97.5 127.375C84.5511 127.375 73.5907 134.004 66.6168 146.047C66.1498 146.939 65.5072 147.728 64.7275 148.366C63.9478 149.004 63.0472 149.477 62.0798 149.758C61.1124 150.039 60.0982 150.121 59.0982 149.999C58.0983 149.878 57.1332 149.555 56.2611 149.051C55.389 148.547 54.6279 147.872 54.0236 147.066C53.4192 146.26 52.9842 145.34 52.7445 144.362C52.5049 143.383 52.4656 142.367 52.6291 141.373C52.7926 140.379 53.1554 139.428 53.6958 138.578C63.3025 121.969 79.267 112.438 97.5 112.438C115.733 112.438 131.698 121.96 141.304 138.578C142.293 140.292 142.561 142.328 142.05 144.239C141.539 146.151 140.29 147.781 138.578 148.773ZM131.109 90.0312C128.894 90.0312 126.728 89.3742 124.885 88.1432C123.043 86.9122 121.607 85.1625 120.759 83.1154C119.911 81.0683 119.689 78.8157 120.122 76.6425C120.554 74.4693 121.621 72.4731 123.188 70.9063C124.754 69.3395 126.751 68.2725 128.924 67.8403C131.097 67.408 133.35 67.6298 135.397 68.4778C137.444 69.3257 139.193 70.7617 140.424 72.604C141.655 74.4464 142.313 76.6124 142.313 78.8281C142.313 81.7994 141.132 84.6489 139.031 86.7499C136.93 88.8509 134.081 90.0312 131.109 90.0312Z"
                    fill="#71C4EF"
                    style={{
                        fill:
                            color === 'dark'
                                ? 'var(--second-primary)'
                                : 'var(--primary)',
                    }}
                />
            </svg>
            <p className={styles.title}>Здесь ничего нет</p>
        </div>
    )
}
