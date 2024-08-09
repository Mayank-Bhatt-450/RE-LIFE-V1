import css from "./task_list.module.css";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Dropdown from 'react-bootstrap/Dropdown';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { getTaskList, postQuestTasks, patchQuestTasks } from '../../utilites/api_util.tsx';
import { useNavigate } from 'react-router-dom';

const _ = (classes: string[]): string => {
    return classes.join(" ").trim();
};

function ImportantTaskList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [tasks, setTasks] = useState({
        "daily_data": [],
        "today_data": [],
        "weekly_data": [],
        "monthly_data": []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('daily');


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredTasks = {
        daily_data: tasks.daily_data.filter(task => task[1].toLowerCase().includes(searchTerm.toLowerCase())),
        today_data: tasks.today_data.filter(task => task[1].toLowerCase().includes(searchTerm.toLowerCase())),
        weekly_data: tasks.weekly_data.filter(task => task[1].toLowerCase().includes(searchTerm.toLowerCase())),
        monthly_data: tasks.monthly_data.filter(task => task[1].toLowerCase().includes(searchTerm.toLowerCase()))
    };
    useEffect(() => {
        fetchtask_list();
    }, []);

    const fetchtask_list = async () => {
        setIsLoading(true);
        try {
            const Response = await getTaskList();
            console.log(Response)
            setTasks(Response);
        } catch (error) {
            console.error("Error fetching open quests:", error);
        }
        setIsLoading(false);
    };

    const getTaskCount = (taskType) => {
        return filteredTasks[`${taskType}_data`].length;
    };

    const task_done = async (task, tag) => {
        console.log(task, tag)
        try {
            const response = await patchQuestTasks({
                index: task[0],
                quest_name_and_agile_status: `${task[5].split('#')[0]}#DONE`,
            });
            console.log('updated', response, tasks);
            console.log('updated', response, tasks[tag][0]);

            setTasks(prevTasks => ({
                ...prevTasks,
                [tag]: prevTasks[tag].filter(t => t[0] !== task[0])
            }));

        } catch (error) {
            console.error('Error updating task status', error);
        }
    };

    return (
        <Container className={_(["mt-5"])}>
            <h1 className="mb-4">Quests List</h1>
            <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Search tasks"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </Form.Group>
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                id="quest-tabs"
                className="mb-3"
            >
                {['daily', 'today', 'weekly', 'monthly'].map((tabKey) => (
                    <Tab
                        key={tabKey}
                        eventKey={tabKey}
                        title={
                            <span>
                                {tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}{' '}
                                <Badge bg="secondary" className={css.tabBadge}>
                                    {isLoading && activeTab === tabKey ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : (
                                        getTaskCount(tabKey)
                                    )}
                                </Badge>
                            </span>
                        }
                    >
                        <TaskList
                            tasks={filteredTasks[`${tabKey}_data`]}
                            type={tabKey}
                            navigate={navigate}
                            tag={`${tabKey}_data`}
                            on_click={task_done}
                            isLoading={isLoading}
                        />
                    </Tab>
                ))}
            </Tabs>
        </Container>
    );
}

function TaskList({ tasks, type, navigate, tag, on_click, isLoading }) {
    const [loadingTask, setLoadingTask] = useState(null);

    const handleOpenTask = (task) => {
        console.log("Opening task:", task);
        navigate(`/add-task?task_id=${task[0]}&quest_name=${task[5].split('#')[0]}&quest_id=${task[5].split('#')[0]}`);
    };

    const handleTaskDone = async (task) => {
        setLoadingTask(task[0]);
        await on_click(task, tag);
        setLoadingTask(null);
    };

    if (isLoading) {
        return <Spinner animation="border" />;
    }

    return (
        <div>
            {tasks.map((task, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="mb-3"
                >
                    <Card className={css.taskCard}>
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <Card.Title>{task[1] || `${type.charAt(0).toUpperCase() + type.slice(1)} Task`}</Card.Title>
                                {task[4] && <Card.Text className="mb-0">Days: {task[4]}</Card.Text>}
                                {task[7] && <Card.Text className="mb-0">Date: {task[7]}</Card.Text>}
                            </div>
                            <div className="d-flex align-items-center">
                                <Button
                                    variant="primary"
                                    className="me-2"
                                    onClick={() => handleTaskDone(task)}
                                    disabled={loadingTask === task[0]}
                                >
                                    {loadingTask === task[0] ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : (
                                        'View'
                                    )}
                                </Button>
                                <Dropdown>
                                    <Dropdown.Toggle variant="light" id={`dropdown-${index}`} className={css.dropdownToggle}>
                                        <ThreeDotsVertical />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handleOpenTask(task)}>Open Task</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </Card.Body>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}

export default ImportantTaskList;