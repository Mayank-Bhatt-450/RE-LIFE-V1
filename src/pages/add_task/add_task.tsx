import React, { useState, useEffect, useRef } from 'react';
import css from "./add_task.module.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import TextArea from "../../components/text_area/text_area";
import DatePicker from "react-datepicker";
import SkillsPointer from "../../components/skill_pointer/skill_pointer";
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { getTask, patchQuestTasks, getMjorSkills, getMinorSkills } from '../../utilites/api_util.tsx';
import { print } from '../../utilites/logger.tsx';
// http://localhost:5173/add-task?task_id=3&quest_name=RE-LIFE&quest_id=6
const _ = (classes) => {
    return classes.join(" ").trim();
};

function AddTask() {
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    const [isLoading, setIsLoading] = useState(true);
    const [taskData, setTaskData] = useState({
        "title": "",
        "description": {
            "time": 1722056962433,
            "blocks": [],
            "version": "2.30.2"
        },
        "priority_or_is_complete": "p1#false",
        "repeating_function_or_due_date": "",
        "quest_name_and_agile_status": "",
        "completion_skill": "",
        "delay_skills": "",
        "skills": [],
        "delayedSkills": [],
        "weekdays": [],
        "dueDate": null
    });

    const [showSkills, setShowSkills] = useState(false);
    const [showDelayedSkills, setShowDelayedSkills] = useState(false);
    const [dropdownSkills, setDropdownSkills] = useState(
        {
        }
    );

    const textAreaRef = useRef(null);
    const loadTask = async () => {
        console.error('fetching task');
        try {
            console.error('fetching task');
            const fetchedData = await getTask(queryParams.task_id);
            console.log('Fetched data:', fetchedData);
            fetchedData['description'] = JSON.parse(fetchedData['description'])
            const parseSkills = (skillString) => {
                return skillString.split('#').map(skill => {
                    const match = skill.match('([^_]*)_([^_\(]*)[(](-?[0-9]*\.?[0-9]*)[)]');
                    return match ? {
                        "majorSkill": {
                            "value": match[1],
                            "label": match[1]
                        },
                        "minorSkill": {
                            "value": match[2],
                            "label": match[2]
                        },
                        "xp": match[3]
                    } : null;
                }).filter(skill => skill !== null);
            };



            var dueDate = () => {
                const dueDate = fetchedData.repeating_function_or_due_date.match('([0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9])');
                console.log('#______', dueDate, !(dueDate[0] === ''))
                if (!(dueDate[0] === '')) {
                    var date_data_list = dueDate[1].split('-')
                    return new Date(date_data_list[2], date_data_list[1] - 1, date_data_list[0])
                }
                return null
            }
            var weekdays = () => {
                var weekday_match = fetchedData.repeating_function_or_due_date.match('([^0-9]*)');
                console.log(weekday_match);
                return (weekday_match[0].length > 0 ? weekday_match[1].replace(/\|$/, '').split('|') : [])
            }
            const skills = parseSkills(fetchedData.completion_skill);
            const delayedSkills = parseSkills(fetchedData.delay_skills);
            try {
                fetchedData['dueDate'] = dueDate()
            } catch { }
            try {
                fetchedData['weekdays'] = weekdays()
            } catch { }
            console.log('Fetched data:', fetchedData);
            setTaskData(prevData => ({
                ...prevData,
                ...fetchedData,
                skills: skills,
                delayedSkills: delayedSkills,
                // dueDate: dueDate(),
                // weekdays: weekdays()
            }));

            setShowSkills(skills.length > 0);
            setShowDelayedSkills(delayedSkills.length > 0);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            // setIsLoading(false);
        }
    };
    const loadMajorSkills = async () => {
        console.error('fetching task');
        try {
            const fetchedData = await getMjorSkills();
            console.log('Fetched data:', fetchedData);

            const skillData = { ...dropdownSkills }; // Clone the current state

            fetchedData['major_skills'].forEach(skill => {
                if (!(skill in skillData)) {
                    skillData[skill] = [];
                }
            });

            setDropdownSkills(skillData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            // setIsLoading(false);
        }
    };
    const loadMionrSkills = async (majorSkill) => {
        console.log('loadMionrSkills');
        try {
            const fetchedData = await getMinorSkills(majorSkill);
            console.log('Fetched data:', fetchedData);

            const skillData = { ...dropdownSkills }; // Clone the current state
            skillData[majorSkill] = fetchedData['minor_skills']
            console.log(majorSkill, skillData)
            setDropdownSkills(skillData);
        } catch (error) {
            console.log('Error fetching data:', error);
        } finally {
            // setIsLoading(false);
        }
    };
    useEffect(() => {
        const process = async () => {
            await loadTask();
            console.log('task loaded')
            await loadMajorSkills();
            console.log('major skill loaded')
            setIsLoading(false);
        }
        if ('task_id' in queryParams) {
            process()

        }
        else {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        console.log('Task data changed:', taskData);
    }, [taskData]);


    const handleInputChange = (field, value) => {
        setTaskData(prevData => ({
            ...prevData,
            [field]: value
        }));
    };

    const formatDate = (date) => {
        if (date instanceof Date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const year = date.getFullYear();
            return `${day}-${month}-${year}`
        }

        return ''
    };

    const handleWeekdayChange = (event) => {
        const { id, checked } = event.target;
        setTaskData(prevData => {
            const newWeekdays = checked
                ? [...prevData.weekdays, id]
                : prevData.weekdays.filter(day => day !== id);
            return {
                ...prevData,
                weekdays: newWeekdays,
                repeating_function_or_due_date: `${newWeekdays.join('|')}|${formatDate(prevData.dueDate)}`
            };
        });
    };

    const handleSkillChange = (index, field, value, loader_flag) => {
        console.log(`### handleSkillChange => 
            index=${index},
             field=${field}, 
             value=${value}, 
             taskData.skills[index][field].value=${taskData.skills[index][field]}, 
             taskData.skills[index]=${JSON.stringify(taskData.skills[index])}`);

        // Check if the new value is empty and the current value is already empty
        if (value === '' && taskData.skills[index][field].value === '') {
            console.log('No change needed');
            return;
        }

        async function load_minor_skill() {
            console.log(true)
            loader_flag(true)
            await loadMionrSkills([value]);
            loader_flag(false)
            console.log(false)
        }

        setTaskData(prevData => {
            const newSkills = [...prevData.skills];
            newSkills[index][field] = { value: value, label: value };

            print('# ADD TASK',
                {
                    'newSkills': newSkills
                }
            )
            if (field === 'majorSkill') {
                if ((Object.keys(dropdownSkills).some(skill => skill === value))) {
                    load_minor_skill()
                }

            }
            else if (field === 'minorSkill') {
                const majorSkill = newSkills[index]['majorSkill'].value;
            }
            else if (field === 'xp') {
                newSkills[index]['xp'] = value;
            }

            return {
                ...prevData,
                skills: newSkills,
                completion_skill: formatCompletionSkills(newSkills)
            };
        });

        console.log('Updated skills:', taskData.skills);
    };

    const handleAddSkill = () => {
        setShowSkills(true);
        setTaskData(prevData => ({
            ...prevData,
            skills: [...prevData.skills, { majorSkill: null, minorSkill: null, xp: '' }]
        }));
    };

    const handleRemoveSkill = (index) => {
        setTaskData(prevData => {
            const newSkills = prevData.skills.filter((_, i) => i !== index);
            setShowSkills(newSkills.length > 0);
            return {
                ...prevData,
                skills: newSkills,
                completion_skill: formatCompletionSkills(newSkills)
            };
        });
    };

    const handleDelayedSkillChange = (index, field, value, loader_flag) => {

        console.log(`### handleSkillChange => 
            index=${index},
             field=${field}, 
             value=${value}, 
             taskData.delayedSkills[index][field].value=${taskData.delayedSkills[index][field]}, 
             taskData.delayedSkills[index]=${JSON.stringify(taskData.delayedSkills[index])}`);

        // Check if the new value is empty and the current value is already empty
        if (value === '' && taskData.delayedSkills[index][field].value === '') {
            console.log('No change needed');
            return;
        }

        setTaskData(prevData => {
            const newDelayedSkills = [...prevData.delayedSkills];
            newDelayedSkills[index][field] = { value: value, label: value };

            print('# ADD TASK',
                {
                    'newSkills': newDelayedSkills
                }
            )
            if (field === 'majorSkill') {
                if ((Object.keys(dropdownSkills).some(skill => skill === value))) {
                    loader_flag(true)
                    loadMionrSkills([value]);
                    loader_flag(false)
                }

            }
            else if (field === 'minorSkill') {
                const majorSkill = newDelayedSkills[index]['majorSkill'].value;
            }
            else if (field === 'xp') {
                newDelayedSkills[index]['xp'] = value;
            }

            return {
                ...prevData,
                delayedSkills: newDelayedSkills,
                delay_skills: formatCompletionSkills(newDelayedSkills)
            };
        });

        console.log('Updated skills:', taskData.skills);
    };

    const handleAddDelayedSkill = () => {
        setShowDelayedSkills(true);
        setTaskData(prevData => ({
            ...prevData,
            delayedSkills: [...prevData.delayedSkills, { majorSkill: null, minorSkill: null, xp: '' }]
        }));
    };

    const handleRemoveDelayedSkill = (index) => {
        setTaskData(prevData => {
            const newDelayedSkills = prevData.delayedSkills.filter((_, i) => i !== index);
            setShowDelayedSkills(newDelayedSkills.length > 0);
            return {
                ...prevData,
                delayedSkills: newDelayedSkills,
                delay_skills: formatCompletionSkills(newDelayedSkills)
            };
        });
    };

    const formatCompletionSkills = (skills) => {
        return skills.map(skill =>
            `${skill.majorSkill?.value || ''}_${skill.minorSkill?.value || ''}(${skill.xp})`
        ).join('#');
    };

    const handleSubmit = async () => {
        console.log(JSON.stringify(taskData.description), JSON.stringify(taskData.description).length >= 50000)
        // if (JSON.stringify(taskData.description).length >= 50000) {
        //     alert("Description exceeds 50000 char limit.");
        //     return
        // }
        // return
        setIsLoading(true);
        try {
            if (textAreaRef.current) {
                const outputData = await textAreaRef.current.get_content();
                taskData.description = outputData
            }
            if (JSON.stringify(taskData.description).length >= 49000) {
                alert("Description exceeds 50000 char limit.");
                setIsLoading(false);
                return
            }
            // delete taskData[key];
            console.log(taskData)
            const updatedData = await patchQuestTasks(JSON.stringify(taskData));
            // setTaskData(updatedData);
            console.log('Task updated successfully:', updatedData);
        } catch (error) {
            console.error('Error updating task:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className={_(["w-100", css.container])}>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/quests">Quests</a></li>
                            <li className="breadcrumb-item"><a href={`/add-quest?quest_name=${taskData.quest_name_and_agile_status.split('#')[0]}&quest_id=${taskData.quest_name_and_agile_status.split('#')[0]}`}>{taskData.quest_name_and_agile_status.split('#')[0]}</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Task</li>
                        </ol>
                    </nav>
                    <h1>Edit Task</h1>
                    <input
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Title"
                        value={taskData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                    <input
                        className="form-control form-control-sm"
                        type="text"
                        placeholder="Priority"
                        value={taskData.priority_or_is_complete.split('#')[0]}
                        onChange={(e) => handleInputChange('priority_or_is_complete', `${e.target.value}#false`)}
                    />
                    <TextArea
                        ref={textAreaRef}
                        prefilledData={taskData.description}
                        setPrefilledData={(data) => handleInputChange('description', data)}
                    />
                    <DatePicker
                        selected={taskData.dueDate}
                        onChange={(date) => {
                            setTaskData(prevData => ({
                                ...prevData,
                                dueDate: date,
                                repeating_function_or_due_date: `${prevData.weekdays.join('|')}|${formatDate(date)}`
                            }));
                        }}
                    />
                    {['MON', 'TUS', 'WED', 'THR', 'FRI', 'SAT', 'SUN'].map((day) => (
                        <React.Fragment key={day}>
                            <input
                                type="checkbox"
                                className="btn-check"
                                id={day}
                                autoComplete="off"
                                checked={taskData.weekdays.includes(day)}
                                onChange={handleWeekdayChange}
                            />
                            <label className="btn" htmlFor={day}>{day}</label>
                        </React.Fragment>
                    ))}



                    <Button className='button' onClick={handleAddSkill}>
                        {showSkills ? 'Add Another Skill' : 'Add Skills'}
                    </Button>
                    {showSkills && (
                        <SkillsPointer
                            skillsObject={dropdownSkills}
                            // onClickOutside={onClickOutside}
                            skills={taskData.skills}
                            onSkillChange={handleSkillChange}
                            onAddSkill={handleAddSkill}
                            onRemoveSkill={handleRemoveSkill}
                        />
                    )}

                    <Button className='button' onClick={handleAddDelayedSkill}>
                        {showDelayedSkills ? 'Add Another Delayed Skill' : 'Add Delayed Skills'}
                    </Button>
                    {showDelayedSkills && (
                        <SkillsPointer
                            skillsObject={dropdownSkills}
                            // minorSkills={minorSkillOptions}
                            skills={taskData.delayedSkills}
                            onSkillChange={handleDelayedSkillChange}
                            onAddSkill={handleAddDelayedSkill}
                            onRemoveSkill={handleRemoveDelayedSkill}
                        />
                    )}


                    <Button className='button' onClick={handleSubmit}>Update Task</Button>
                </>

            )}
        </Container>
    );
}

export default AddTask;