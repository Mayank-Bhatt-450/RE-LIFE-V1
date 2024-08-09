import React from 'react';
// import './ProgressBar.css';
import css from "./progress_bar.module.css";
const _ = (classes: string[]): string => {
    let s = "";
    classes.map((i) => (s += i + " "));
    return s.trim();
};
interface Props {
    onClick?: () => void
    amount: number
    total: number
}


function ProgressBar(props: Props) {
    return (
        <div className={_(["", css.progress_bar_container])}>
            <div className={_(["", css.progress_bar])} style={{ width: `${(props.amount / props.total) * 100}%` }}></div>
            <span className={_(["", css.progress_text])}>{`${props.amount}/${props.total}`}</span>
        </div>
    );
};

export default ProgressBar;