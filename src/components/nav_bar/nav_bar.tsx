import css from "./nav_bar.module.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavButton from "./nav_button";
import Button from 'react-bootstrap/Button';
import { BsCircleFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
const _ = (classes: string[]): string => {
    let s = "";
    classes.map((i) => (s += i + " "));
    return s.trim();
};
// {_(["navbar navbar-expand-lg bg-body-tertiary"])}
// https://react-bootstrap.netlify.app/docs/components/navbar
function NavBar() {

    const navigate = useNavigate();
    return (
        <Navbar sticky="top" expand="lg" className={_([css.nav_bar])}>
            <Container>
                <Navbar.Brand href="/profile" className={_([css.home_icon])}>✤ RE-LIFE</Navbar.Brand>
                <div className={_(["", css.ham_button_div])}>
                    <p className={_(["", css.p])}>{1}</p>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className={_(["", css.button_div])} />
                </div>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className={_([""])}>
                        <NavButton text='MARKET PLACE' onClick={() => navigate(`/marketplace`)} />
                        <NavButton text='DAILY TASKS' onClick={() => navigate(`/task-list`)} />
                    </Nav>
                    <span className={_([" ", css.nav_lefter])}>
                        <NavButton text='QUESTS' onClick={() => navigate(`/quests`)} />
                    </span>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
}

export default NavBar;