import React, { useState, useEffect } from 'react';
import css from "./skill_pointer.module.css";
import Button from 'react-bootstrap/Button';
import Select from '../select_dropdown/select_dropdown';
import { print } from '../../utilites/logger';

const _ = (classes: string[]): string => {
    return classes.join(" ").trim();
};

interface SkillOption {
    value: string;
    label: string;
}

interface Skill {
    majorSkill: SkillOption | null;
    minorSkill: SkillOption | null;
    xp: string;
}

interface Props {
    skillsObject: any;
    skills: Skill[];
    onSkillChange: (index: number, field: keyof Skill, value: any, setSpinner: (flag: boolean) => void) => void;
    onAddSkill: () => void;
    onRemoveSkill: (index: number) => void;
}

function SkillsPointer({
    skillsObject,
    skills,
    onSkillChange,
    onAddSkill,
    onRemoveSkill
}: Props) {
    const [majorSkillSelects, setMajorSkillSelects] = useState<string[]>(skills.map(() => ''));
    const [spinners, setSpinners] = useState<boolean[]>(skills.map(() => false));

    const onMajorSkillSelection = (selectedOption, index) => {
        print('## onMajorSkillSelection', { 'selectedOption': selectedOption, index: index });
        setMajorSkillSelects(prev => {
            const newSelects = [...prev];
            newSelects[index] = selectedOption;
            return newSelects;
        });
        onSkillChange(index, 'majorSkill', selectedOption, (flag) => updateSpinner(index, flag));
    };

    const updateSpinner = (index, flag) => {
        setSpinners(prev => {
            const newSpinners = [...prev];
            newSpinners[index] = flag;
            return newSpinners;
        });
    };

    print('### SkillsPointer:HOME', { 'skills': skills, 'majorSkillSelects': majorSkillSelects, 'spinners': spinners });

    return (
        <div className={_(["container text-center", css.container])}>
            {skills.map((skill, index) => (
                <div key={index} className={_(["row", css.row])}>
                    {(!spinners[index] ?
                        <>
                            <div className={_(["col-sm-3 d-flex flex-column align-items-center justify-content-center", css.image_col])}>
                                <Select
                                    options={Object.keys(skillsObject)}
                                    placeholder={skill.majorSkill?.value}
                                    onChange={(selectedOption) => onMajorSkillSelection(selectedOption, index)}
                                />
                                {/* {spinners[index] && <div className={css.spinner}>Loading...</div>} */}
                            </div>
                            <div className={_(["col-sm-3 d-flex flex-column align-items-center justify-content-center", css.image_col])}>
                                <Select
                                    options={(skillsObject[majorSkillSelects[index]] || [])}
                                    onChange={(selectedOption) => onSkillChange(index, 'minorSkill', selectedOption, (flag) => updateSpinner(index, flag))}
                                    placeholder={skill.minorSkill?.value || "Select Minor Skill"}
                                />
                                {spinners[index] && <div className={css.spinner}>Loading...</div>}
                            </div>
                            <div className={_(["col-sm-3 d-flex flex-column align-items-center justify-content-center", css.image_col])}>
                                <input
                                    className="form-control form-control-sm"
                                    type="number"
                                    placeholder="XP"
                                    value={skill.xp}
                                    onChange={(e) => onSkillChange(index, 'xp', e.target.value, (flag) => updateSpinner(index, flag))}
                                />
                            </div>
                            <div className={_(["col-sm-3 d-flex flex-column align-items-center justify-content-center", css.image_col])}>
                                <Button variant="danger" onClick={() => onRemoveSkill(index)}>Remove</Button>
                            </div>
                        </> : <div className={css.spinner}>Loading...</div>)}
                </div>
            ))}
        </div>
    );
};

export default SkillsPointer;
