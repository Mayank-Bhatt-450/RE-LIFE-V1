import css from "./quests.module.css";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import queryString from 'query-string';
import { getQuests, postQuestTasks, patchQuestTasks } from '../../utilites/api_util.tsx';

const _ = (classes: string[]): string => {
    return classes.join(" ").trim();
};

function Quests() {
    const [openQuests, setOpenQuests] = useState([]);
    const [closedQuests, setClosedQuests] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newQuestTitle, setNewQuestTitle] = useState("");
    const [activeTab, setActiveTab] = useState('open');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOpenQuests();
    }, []);

    const fetchOpenQuests = async () => {
        setIsLoading(true);
        try {
            const openResponse = await getQuests('false');
            console.log(openResponse)
            setOpenQuests(openResponse);
        } catch (error) {
            console.error("Error fetching open quests:", error);
        }
        setIsLoading(false);
    };

    const fetchClosedQuests = async () => {
        setIsLoading(true);
        try {
            const closedResponse = await getQuests('true');
            setClosedQuests(closedResponse);
        } catch (error) {
            console.error("Error fetching closed quests:", error);
        }
        setIsLoading(false);
    };

    const handleTabSelect = (key) => {
        setActiveTab(key);
        if (key === 'closed' && closedQuests.length === 0) {
            fetchClosedQuests();
        }
    };

    const filteredOpenQuests = openQuests.filter(quest =>
        quest.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredClosedQuests = closedQuests.filter(quest =>
        quest.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addNewQuest = async () => {
        setIsLoading(true);
        try {
            setShowAddModal(false);
            const response = await postQuestTasks('', JSON.stringify({
                'title': `${newQuestTitle}`,
                'description': { "time": 1722625644255, "blocks": [{ "id": "98GeseIIHO", "type": "header", "data": { "text": "${newQuestTitle.trim()}", "level": 2 } }], "version": "2.30.2" },
                'priority_or_is_complete': 'p1#false',
                'repeating_function_or_due_date': '',
                'quest_name_and_agile_status': 'QUEST',
                'completion_skill': '',
                'delay_skills': ''
            }));
            // Ensure response data is available and log the response
            if (response.task) {
                console.log('Quest added successfully:', response.task);
                setOpenQuests([...openQuests, response.task]);
                setNewQuestTitle("");
            } else {
                console.error('Unexpected response structure:', response);
            }
        } catch (error) {
            console.error('Failed to add new task:', error);
            // TODO: Show error message to user
        } finally {
            setIsLoading(false);
        }
    };

    const closeQuest = async (id) => {

        setIsLoading(true);
        try {
            // Make the API call to update the quest
            const response = await patchQuestTasks({
                "index": id,
                'priority_or_is_complete': 'p1#true',
            });
            if (closedQuests.length > 0) {
                // Update state with the new response data
                setClosedQuests([...closedQuests, response]); // Assuming response.data contains the updated quest
            }


            // Remove the quest with the given id from openQuests
            setOpenQuests(openQuests.filter(quest => quest.index !== id));

            // Optionally update the quests state if needed
            // setQuests(quests.map(quest =>
            //     quest.index === id ? { ...quest, priority_or_is_complete: "p1#true" } : quest
            // ));
            setIsLoading(false)

        } catch (error) {
            console.error('Failed to close quest:', error);
            // TODO: Show error message to user
        } finally {
            setIsLoading(false);
        }
    };

    const getIcon = (quest) => {
        const match = quest.title.match('([^a-zA-Z0-9:-]*)(?=[a-zA-Z0-9:-]|$).*');
        return match[1] ? match[1] : quest.title[0];
    };

    const QuestCard = ({ quest }) => {
        var queryparam_quest = encodeURIComponent(quest.title);
        console.log(queryparam_quest)
        return (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >

                <Card className={css.questCard}>
                    <Card.Body>

                        <div className={css.cardHeader}>
                            <div className={css.questImagePlaceholder}>
                                {getIcon(quest)}
                            </div>
                            <Dropdown className={css.cardDropdown}>
                                <Dropdown.Toggle variant="light" id={`dropdown-${quest.index}`}>
                                    ⋮
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => closeQuest(quest.index)}>
                                        {quest.priority_or_is_complete.endsWith("#false") ? "Close Quest" : "Reopen Quest"}
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <a href={`/add-quest?quest_name=${queryparam_quest}&quest_id=${quest.index}`}>
                            <Card.Title>{quest.title}</Card.Title>
                            <Card.Text>
                                Priority: {quest.priority_or_is_complete.split('#')[0]}
                                <br />
                                Last Updated: {new Date(quest.updated_date).toLocaleString()}
                            </Card.Text>
                        </a>
                    </Card.Body>
                </Card>

            </motion.div >
        )
    };

    return (
        <Container className={_(["mt-5"])}>
            <Row className="mb-4">
                <Col md={8}>
                    <Form.Control
                        type="text"
                        placeholder="Search quests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={4}>
                    <Button variant="primary" onClick={() => setShowAddModal(true)}>Add New Quest</Button>
                </Col>
            </Row>

            <Tabs activeKey={activeTab} onSelect={handleTabSelect} id="quest-tabs" className="mb-3">
                <Tab eventKey="open" title="Open Quests">
                    {isLoading ? (
                        <div className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <Row xs={1} md={2} lg={3} className="g-4">
                            {filteredOpenQuests.map((quest) => (
                                <Col key={quest.index}>
                                    <QuestCard quest={quest} />
                                </Col>
                            ))}
                        </Row>
                    )}
                </Tab>
                <Tab eventKey="closed" title="Closed Quests">
                    {isLoading ? (
                        <div className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <Row xs={1} md={2} lg={3} className="g-4">
                            {filteredClosedQuests.map((quest) => (
                                <Col key={quest.index}>
                                    <QuestCard quest={quest} />
                                </Col>
                            ))}
                        </Row>
                    )}
                </Tab>
            </Tabs>

            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Quest</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        placeholder="Enter quest title"
                        value={newQuestTitle}
                        onChange={(e) => setNewQuestTitle(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addNewQuest}>
                        Add Quest
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Quests;