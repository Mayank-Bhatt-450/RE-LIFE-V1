import React from 'react';
import sample_profile from '../../assets/sample_profile.png'
import css from "./buy_model.module.css";

import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const _ = (classes: string[]): string => {
    let s = "";
    classes.map((i) => (s += i + " "));
    return s.trim();
};

export interface IModal {
    title: string
    body: string
    close: string
    accept: string
    open_flag: boolean
    handleClose: () => void
    closeButton: () => void
}



function BuyModal(props: IModal) {


    return (
        <div>
            <Modal
                show={props.open_flag}
                onHide={props.handleClose}
                backdrop="static"
                keyboard={false}
                className={_(["w-100 h-100",])}
            >
                <Modal.Header >
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.body}
                </Modal.Body>
                <Modal.Footer>
                    <Button className={_(["button",])}>{props.accept}</Button>
                    <Button className={_(["button",])} onClick={props.handleClose}>
                        {props.close}
                    </Button>

                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default BuyModal;
