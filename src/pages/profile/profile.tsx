import css from "./profile.module.css";
import React, { useState, useEffect, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import sample_profile from '../../assets/sample_profile.png'
// import ProgressBar from 'react-bootstrap/ProgressBar';
import ProgressBar from "../../components/progress_bar/progress_bar";
import SkillsButton from "../../components/skills_button/skills_button";
import { GiCaptainHatProfile, GiBrain, GiOpenTreasureChest, GiCrown, GiTreasureMap, GiHealthPotion } from "react-icons/gi";
import { getProfile } from "../../utilites/api_util";
import { useNavigate } from 'react-router-dom';



const _ = (classes: string[]): string => {
    let s = "";
    classes.map((i) => (s += i + " "));
    return s.trim();
};

function Profile() {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const process = async () => {
            try {
                const fetchedData = await getProfile();
                console.log('Fetched data:', fetchedData);
                setProfileData(fetchedData);
                console.log(fetchedData.skills.INTELLIGENCE)
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        process();
    }, []);




    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <Container className={_(["", css.container])}>
            <div className={_(["", css.card])}>
                <div className={_(["container text-center", css.container])}>
                    <h1 className={_(["container text-center", css.coins])}>✤: {profileData.coins}</h1>
                </div>
                <hr></hr>

                {/* <img src={sample_profile} alt="Profile" className={_(["", css.image])} /> */}
                <div className={_(["", css.profile_container])}>
                    <div className={_(["d-flex flex-column align-items-center justify-content-center", css.profile_container_button])}>
                        <GiCaptainHatProfile className={_(["", css.profile_button])} />
                    </div>
                    <img src={sample_profile} alt="Profile" className={_(["", css.image])} />
                </div>
                <div className={_(["container text-center", css.coins])}>NEXT LEVEL: {profileData.max_level}</div>
                <hr></hr>
                <div className={_(["container text-center", css.container])}>
                    <div className={_(["row", css.container])}>
                        <div className={_(["col", css.text])}>{profileData.name}</div>
                        <div className={_(["col", css.text])}>Level {Math.floor(profileData.total_xp / 1000)}</div>
                        {/* <div className={_(["col", css.container])}>Coin 100</div> */}
                    </div>
                </div>

                <ProgressBar amount={profileData.total_xp % 1000} total={1000} ></ProgressBar>

                <hr></hr>
                <hr></hr>

                <SkillsButton
                    amount={(profileData.skills.INTELLIGENCE ? profileData.skills.INTELLIGENCE.xp % 1000 : 0)}
                    total={1000}
                    title='Intelligence'
                    Icon={GiBrain}
                    level={(profileData.skills.INTELLIGENCE ? Math.floor(profileData.skills.INTELLIGENCE.xp / 1000) : 0)}
                    tasks={(profileData.skills.INTELLIGENCE ? profileData.skills.INTELLIGENCE.tasks : 0)}
                    onClick={() => navigate(`/sub-skills?major_skill=INTELLIGENCE`)}
                ></SkillsButton>
                <hr></hr>
                <SkillsButton
                    amount={(profileData.skills.HEALTH ? profileData.skills.HEALTH.xp % 1000 : 0)}
                    total={1000}
                    title='Health'
                    Icon={GiHealthPotion}
                    level={(profileData.skills.HEALTH ? Math.floor(profileData.skills.HEALTH.xp / 1000) : 0)}
                    tasks={(profileData.skills.HEALTH ? profileData.skills.HEALTH.tasks : 0)}
                    onClick={() => navigate(`/sub-skills?major_skill=HEALTH`)}
                ></SkillsButton>
                <hr></hr>
                <SkillsButton
                    amount={(profileData.skills.WEALTH ? profileData.skills.WEALTH.xp % 1000 : 0)}
                    total={1000}
                    title='Wealth'
                    Icon={GiOpenTreasureChest}
                    level={(profileData.skills.WEALTH ? Math.floor(profileData.skills.WEALTH.xp / 1000) : 0)}
                    tasks={(profileData.skills.WEALTH ? profileData.skills.WEALTH.tasks : 0)}
                    onClick={() => navigate(`/sub-skills?major_skill=WEALTH`)}
                ></SkillsButton>
                <hr></hr>
                <SkillsButton
                    amount={(profileData.skills.CHARISMA ? profileData.skills.CHARISMA.xp % 1000 : 0)}
                    total={1000}
                    title='Charisma'
                    Icon={GiCrown}
                    level={(profileData.skills.CHARISMA ? Math.floor(profileData.skills.CHARISMA.xp / 1000) : 0)}
                    tasks={(profileData.skills.CHARISMA ? profileData.skills.CHARISMA.tasks : 0)}
                    onClick={() => navigate(`/sub-skills?major_skill=CHARISMA`)}
                ></SkillsButton>
                <hr></hr>
                <SkillsButton
                    amount={(profileData.skills.EXPLORER ? profileData.skills.EXPLORER.xp % 1000 : 0)}
                    total={1000}
                    title='Explorer'
                    Icon={GiTreasureMap}
                    level={(profileData.skills.EXPLORER ? Math.floor(profileData.skills.EXPLORER.xp / 1000) : 0)}
                    tasks={(profileData.skills.EXPLORER ? profileData.skills.EXPLORER.tasks : 0)}
                    onClick={() => navigate(`/sub-skills?major_skill=EXPLORER`)}
                ></SkillsButton>

            </div>
        </Container >
    );
}

export default Profile;