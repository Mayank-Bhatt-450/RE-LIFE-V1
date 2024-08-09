import css from "./market_place.module.css";
import Container from 'react-bootstrap/Container';
import sample_profile from '../../assets/sample_profile.png'
// import ProgressBar from 'react-bootstrap/ProgressBar';
import ProgressBar from "../../components/progress_bar/progress_bar";
import Product from "../../components/product/product";
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import BuyModal from "../../components/buy_model/buy_model";


const _ = (classes: string[]): string => {
    let s = "";
    classes.map((i) => (s += i + " "));
    return s.trim();
};

function MarketPlace() {
    const [buy_model_flag, setShow] = useState(false);

    const toogleClose = () => setShow(!buy_model_flag)

    return (
        <>

            <Container className={_(["",])}>
                <BuyModal
                    title="string"
                    body="string"
                    close="Close"
                    accept="Buy"
                    open_flag={buy_model_flag}
                    handleClose={toogleClose}
                    closeButton={toogleClose}
                ></BuyModal >

                <div className={_(["row",])}>
                    <div className={_(["col ", css.button])}>

                        <Button className={_(["button",])}>ADD NEW ITEM</Button>
                    </div>
                    <div className={_(["col ", css.button])}>

                        <Button className={_(["button",])}>PURCHESED</Button>
                    </div>
                </div>
                <div className={_(["", css.balance])}>
                    ✤: 1212121
                </div>

                <div className={_(["row row-cols-1 row-cols-md-3 g-4",])}>
                    <div className={_(["col",])}>
                        <Product
                            id={1}
                            name="string"
                            description="string"
                            price={1}
                            left="string"
                            onClick={toogleClose}
                        ></Product>
                    </div>
                    <div className={_(["col",])}>
                        <Product
                            id={1}
                            name="string"
                            description="string"
                            price={1}
                            left="string"
                        ></Product>
                    </div>
                    <div className={_(["col",])}>
                        <Product
                            id={1}
                            name="string"
                            description="string"
                            price={1}
                            left="string"
                        ></Product>
                    </div>
                    <div className={_(["col",])}>
                        <Product
                            id={1}
                            name="string"
                            description="string"
                            price={1}
                            left="string"
                        ></Product>
                    </div>
                    <div className={_(["col",])}>
                        <Product
                            id={1}
                            name="string"
                            description="string"
                            price={1}
                            left="string"
                        ></Product>
                    </div>

                </div>
            </Container >
        </>
    );
}

export default MarketPlace;