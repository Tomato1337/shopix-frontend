import { FC } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { paths } from '@/shared/config/router'
import { getToken } from '@/shared/config/storage'
import styles from './styles.module.scss'

interface NavigationProps {
    setIsPopup: (arg: boolean) => void
    username: string
    image?: string
}

export const Navigation: FC<NavigationProps> = ({
    setIsPopup,
    username = 'Guest',
    image,
}) => {
    const navigate = useNavigate()
    const handlePopup = () => {
        const token = getToken()
        if (token) {
            setIsPopup(true)
        } else {
            navigate(paths.auth)
        }
    }

    // console.log(username)

    return (
        <div className={styles.nav}>
            <nav>
                <ul className={styles.links}>
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) => {
                                console.log(isActive)
                                return isActive
                                    ? `${styles.link} ${styles.active}`
                                    : styles.link
                            }}
                        >
                            Главная
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={paths.chats}
                            className={({ isActive }) =>
                                isActive
                                    ? `${styles.active}  ${styles.link}`
                                    : styles.link
                            }
                        >
                            Чаты <span className={styles.chats}>6</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <div onClick={handlePopup} className={styles.logo}>
                {image ? (
                    <img src={image} alt="profile" />
                ) : (
                    username.slice(0, 1).toUpperCase()
                )}
                {/* <img src="/public/images/profile.png" alt="profile" /> */}
            </div>
        </div>
    )
}
