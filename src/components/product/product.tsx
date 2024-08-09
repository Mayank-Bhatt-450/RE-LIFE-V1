import React from 'react';
import sample_profile from '../../assets/sample_profile.png'
import css from "./product.module.css";

const _ = (classes: string[]): string => {
    let s = "";
    classes.map((i) => (s += i + " "));
    return s.trim();
};

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    left: string;
    onClick?: () => void
}

function Product(props: Product) {
    return (
        <div className={_(["card h-100",])}>
            {/* <div className={_(["", css.left_count])}>Left: 21121212 </div> */}
            <img src={sample_profile} className={_(["card-img-top",])} alt="..." />

            <div className={_(["card-body",])}>
                <h5 className={_(["card-title",])}>{props.name}</h5>
                <p className={_(["card-text",])}>{props.description}</p>
            </div>

            <div className={_(["",])}>
                <div className={_(["", css.buy_button])} onClick={props.onClick}>BUY: {props.price} /-</div>
                {/* <div className={_(["", css.buy_button])}>1212121212 left</div> */}
            </div>

            <div className={_(["card-footer", css.left_count])}>
                <small className={_(["text-body-secondary",])}>{props.left} - LEFT</small>
            </div>

        </div>
    )
}

export default Product;
