import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { dot } from 'node:test/reporters'
import classNames from 'classnames'
import Slider from 'react-slick'
import './styles.scss'

export const ImageSlider = ({ images }: { images: string[] }) => {
    const settings = {
        customPaging: function (i) {
            console.log(i)
            return (
                <a className={'dot'}>
                    <img src={images[i]} />
                </a>
            )
        },
        adaptiveHeight: false,
        variableWidth: false,
        centerPadding: 0,
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        dotsClass: 'dots',
        className: 'slick',
        nextArrow: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="36"
                viewBox="0 0 21 36"
                fill="none"
            >
                <path
                    d="M1.35181 1.79557L19.9997 18.108L1.35181 34.4204"
                    stroke="#1D1C1C"
                    stroke-width="2"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        ),
        prevArrow: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="36"
                viewBox="0 0 21 36"
                fill="none"
            >
                <path
                    d="M19.6479 34.4202L1.00004 18.1078L19.6479 1.79541"
                    stroke="#1D1C1C"
                    stroke-width="2"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        ),
    }
    console.log(images)

    return (
        <div className={'slider'}>
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index}>
                        <img src={image} alt={`Slide ${index}`} />
                    </div>
                ))}
            </Slider>
        </div>
    )
}
