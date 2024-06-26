import imageCompression from 'browser-image-compression'
import classNames from 'classnames'
import { FC, HTMLAttributes, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from './styles.module.scss'

interface ImagesDropProps extends HTMLAttributes<HTMLDivElement> {
    images: (File | string)[]
    currentAvatar?: string | null
    setImages: (images: (File | string)[]) => void
    isAvatar?: boolean
}

export const ImagesDrop: FC<ImagesDropProps> = ({
    images,
    setImages,
    currentAvatar,
    className,
    children,
    isAvatar = false,
    ...props
}) => {
    const handelDeletePhoto = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: async (acceptedFiles) => {
            const type = acceptedFiles[0].type
            const options = {
                maxSizeMB: 1,
                useWebWorker: true,
            }

            if (type.includes('image')) {
                const compressedFileBlob = await imageCompression(
                    acceptedFiles[0],
                    options,
                )
                const convertedToFile = new File(
                    [compressedFileBlob],
                    compressedFileBlob.name,
                    {
                        type: compressedFileBlob.type,
                    },
                )
                if (isAvatar) {
                    setImages([convertedToFile])
                }
                if (!isAvatar) {
                    setImages([...images, convertedToFile])
                }
            }
        },
    })
    console.log(images)

    return (
        <div
            {...getRootProps({
                className: classNames('dropzone', styles.photos, className),
            })}
            {...props}
        >
            {!isAvatar
                ? images.map((img, index) => (
                      <div className={styles.wrapper} key={index}>
                          <Card
                              className={styles.card}
                              handelDeletePhoto={handelDeletePhoto}
                              img={img}
                              cardId={index}
                          />
                      </div>
                  ))
                : null}
            <div
                style={{
                    backgroundImage:
                        isAvatar && images.length > 0
                            ? `url(${
                                  typeof images[0] === 'string'
                                      ? images[0]
                                      : URL.createObjectURL(images[0])
                              })`
                            : 'none',

                    // opacity: isAvatar ? 0.6 : 1,
                }}
                className={styles['add-photo']}
            >
                <div
                    className={styles.wrapperCard}
                    style={{
                        backgroundColor:
                            isAvatar && images.length > 0
                                ? 'rgba(0, 0, 0, 0.6)'
                                : 'var(--second-primary)',
                    }}
                >
                    <label style={{ cursor: 'pointer' }}>
                        <svg
                            className={styles.icon}
                            xmlns="http://www.w3.org/2000/svg"
                            width="84"
                            height="76"
                            viewBox="0 0 84 76"
                            fill="none"
                        >
                            <path
                                d="M8.66634 8.66658H21.1663L29.4997 0.333252H54.4997L62.833 8.66658H75.333C77.5432 8.66658 79.6628 9.54456 81.2256 11.1074C82.7884 12.6702 83.6664 14.7898 83.6664 16.9999V66.9999C83.6664 69.2101 82.7884 71.3297 81.2256 72.8925C79.6628 74.4553 77.5432 75.3333 75.333 75.3333H8.66634C6.4562 75.3333 4.33659 74.4553 2.77378 72.8925C1.21098 71.3297 0.333008 69.2101 0.333008 66.9999V16.9999C0.333008 14.7898 1.21098 12.6702 2.77378 11.1074C4.33659 9.54456 6.4562 8.66658 8.66634 8.66658ZM41.9997 21.1666C36.4743 21.1666 31.1753 23.3615 27.2683 27.2685C23.3613 31.1755 21.1663 36.4746 21.1663 41.9999C21.1663 47.5253 23.3613 52.8243 27.2683 56.7313C31.1753 60.6383 36.4743 62.8332 41.9997 62.8332C47.525 62.8332 52.8241 60.6383 56.7311 56.7313C60.6381 52.8243 62.833 47.5253 62.833 41.9999C62.833 36.4746 60.6381 31.1755 56.7311 27.2685C52.8241 23.3615 47.525 21.1666 41.9997 21.1666ZM41.9997 29.4999C45.3149 29.4999 48.4943 30.8169 50.8385 33.1611C53.1827 35.5053 54.4997 38.6847 54.4997 41.9999C54.4997 45.3151 53.1827 48.4945 50.8385 50.8388C48.4943 53.183 45.3149 54.4999 41.9997 54.4999C38.6845 54.4999 35.505 53.183 33.1608 50.8388C30.8166 48.4945 29.4997 45.3151 29.4997 41.9999C29.4997 38.6847 30.8166 35.5053 33.1608 33.1611C35.505 30.8169 38.6845 29.4999 41.9997 29.4999Z"
                                fill="white"
                            />
                        </svg>
                    </label>
                    <input
                        {...getInputProps()}
                        className={styles['photo-input']}
                        type="file"
                        id="file"
                    />
                </div>
            </div>
            {children}
        </div>
    )
}

interface ICard extends HTMLAttributes<HTMLDivElement> {
    img: Blob | MediaSource | string
    cardId: number
    handelDeletePhoto: (index: number) => void
}

const Card: FC<ICard> = ({ img, cardId, handelDeletePhoto }) => {
    const [isHover, setIsHover] = useState(false)
    return (
        <div
            className={styles.wrapper}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <div
                className={styles['wrapper-del']}
                style={{ display: isHover ? 'block' : 'none' }}
            >
                <svg
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handelDeletePhoto(cardId)
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="26"
                    viewBox="0 0 24 26"
                    fill="none"
                >
                    <path
                        d="M1.33301 6.33333H22.6663M9.33301 11.6667V19.6667M14.6663 11.6667V19.6667M2.66634 6.33333L3.99967 22.3333C3.99967 23.0406 4.28063 23.7189 4.78072 24.219C5.28082 24.719 5.9591 25 6.66634 25H17.333C18.0403 25 18.7185 24.719 19.2186 24.219C19.7187 23.7189 19.9997 23.0406 19.9997 22.3333L21.333 6.33333M7.99967 6.33333V2.33333C7.99967 1.97971 8.14015 1.64057 8.3902 1.39052C8.64025 1.14048 8.97939 1 9.33301 1H14.6663C15.02 1 15.3591 1.14048 15.6092 1.39052C15.8592 1.64057 15.9997 1.97971 15.9997 2.33333V6.33333"
                        stroke="#00BAFF"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </div>
            <img
                className={styles.photo}
                src={
                    typeof img === 'string'
                        ? img
                        : URL.createObjectURL(img || new Blob())
                }
                alt="photo"
            />
        </div>
    )
}
