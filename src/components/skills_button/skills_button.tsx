import React from 'react';
// import './ProgressBar.css';
import css from "./skills_button.module.css";
import ProgressBar from "../../components/progress_bar/progress_bar";
import { GiBrain, GiOpenTreasureChest, GiCrown, GiTreasureMap, GiHealthPotion } from "react-icons/gi";
import { IconType } from 'react-icons';

const _ = (classes: string[]): string => {
    let s = "";
    classes.map((i) => (s += i + " "));
    return s.trim();
};
interface Props {
    onClick?: () => void
    title: string
    Icon: IconType
    tasks: number
    level: number
    amount: number
    total: number
}


function SkillsButton(props: Props) {
    return (
        <div className={_(["container text-center", css.container])} onClick={props.onClick}>
            <div className={_(["row", css.row])}>
                <div className={_(["col-sm-3 d-flex flex-column align-items-center justify-content-center", css.image_col])}>
                    <div className={_(["row", css.icon])}>
                        <div className={_(["col"])}>
                            <props.Icon className={_(["", css.img])}></props.Icon>
                        </div>

                    </div>
                    <div className={_(["row", css.icon])}>

                        <div className={_(["col", css.title])}>{props.title}</div>
                    </div>
                </div>

                <div className={_(["col ", css.level_bar])}>
                    <div className={_(["row d-flex align-items-center justify-content-center",])}>

                        <div className={_(["col", css.text])}>LEVEL: <span className={_(["col", css.pop_text])}> {props.level}</span></div>
                        {(props.tasks != null ? <div className={_(["col", css.text])}>TASKS: <span className={_(["col", css.pop_text])}> {props.tasks}</span></div> : <></>)}
                    </div>
                    <div className={_(["row ", css.progress_bar])}>
                        <div className={_(["",])}>
                            <ProgressBar amount={props.amount} total={props.total} ></ProgressBar>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
};

export default SkillsButton;