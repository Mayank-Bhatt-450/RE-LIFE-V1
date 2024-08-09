import React, { useState, useEffect } from 'react';
import css from "./sub_task.module.css";
import Container from 'react-bootstrap/Container';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { getSubTask } from '../../utilites/api_util.tsx';
import { print } from '../../utilites/logger.tsx';
import { GiSkills } from "react-icons/gi";

import SkillsButton from "../../components/skills_button/skills_button";
const _ = (classes) => {
    return classes.join(" ").trim();
};

function SubSkillsPage() {
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    const [isLoading, setIsLoading] = useState(true);
    const [subSkills, setSubSkills] = useState([]);

    useEffect(() => {
        const fetchSubSkills = async () => {
            try {
                const majorSkill = queryParams.major_skill;
                if (majorSkill) {
                    const subTaskData = await getSubTask(majorSkill);
                    setSubSkills(subTaskData);
                }
            } catch (error) {
                print('Error fetching sub-skills:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubSkills();
    }, [queryParams.task_id]);

    return (
        <Container className={_(["w-100", css.container])}>
            {isLoading ? (
                <p>Loading...</p>
            ) : (subSkills.length > 0 ?
                <>
                    {
                        subSkills.map(([skillName, xp], index) => (
                            <SkillsButton
                                amount={(xp % 1000)}
                                total={1000}
                                title={skillName}
                                Icon={GiSkills}
                                level={Math.floor(xp / 1000)}
                            ></SkillsButton>
                        ))
                    }
                </>
                :
                <p>No sub-skills found.</p>
            )}

        </Container >
    );
}

export default SubSkillsPage;