import css from "./nav_button.module.css";
import Button from 'react-bootstrap/Button';
import { BsCircleFill } from "react-icons/bs";
const _ = (classes: string[]): string => {
    let s = "";
    classes.map((i) => (s += i + " "));
    return s.trim();
};

interface Props {
    text: string
    onClick?: () => void
    notification_count?: string
}
// {_(["navbar navbar-expand-lg bg-body-tertiary"])}
// https://react-bootstrap.netlify.app/docs/components/navbar
function NavButton(props: Props) {
    return (

        <div className={_(["", css.button_div])}>
            <p className={_(["", css.p])}>{props.notification_count}</p>
            {/* <BsCircleFill className={_(["", css.p])} /> */}
            <Button className={_(["button", css.nav_button])} onClick={props.onClick}>{props.text}</Button>
        </div>


    );
}

export default NavButton;