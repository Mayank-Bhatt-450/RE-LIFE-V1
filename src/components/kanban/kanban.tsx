import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { postQuestTasks, patchQuestTasks } from '../../utilites/api_util';

// Define types for tasks and columns
interface Task {
    id: string;
    title: string;
}

interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

interface KanbanProps {
    quest_name: string;
    quest_id: string;
    data: Column[];
    setData: React.Dispatch<React.SetStateAction<Column[]>>;
}




const Kanban: React.FC<KanbanProps> = ({ quest_name, quest_id, data, setData }) => {
    // State hooks for managing various aspects of the Kanban board
    const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
    const [editingColumnTitle, setEditingColumnTitle] = useState<string>('');
    const [openOptionsTaskId, setOpenOptionsTaskId] = useState<string | null>(null);
    const [newTaskContent, setNewTaskContent] = useState<string>('');
    const [addingTaskToColumnId, setAddingTaskToColumnId] = useState<string | null>(null);
    const [newColumnTitle, setNewColumnTitle] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [columnSearchTerms, setColumnSearchTerms] = useState<{ [key: string]: string }>({});

    // const quest_name = 'RE-LIFE'
    // Refs for managing focus and click outside detection
    const editTitleRef = useRef<HTMLInputElement>(null);
    const optionsMenuRef = useRef<HTMLDivElement>(null);
    console.log('data====', data)
    // Function to handle drag-and-drop events
    const onDragEnd = async (result: DropResult) => {
        const { source, destination } = result;

        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
            return;
        }

        const newData = moveTask(data, source.droppableId, destination.droppableId, source.index, destination.index);
        const originalData = [...data];

        setIsLoading(true);
        try {
            // console.log('newData !== originalData', newData !== data)
            if (newData !== data) {
                const response = await patchQuestTasks({
                    'index': newData[source.index]['tasks'][destination.index].id,
                    'quest_name_and_agile_status': `${quest_id}#${destination.droppableId}`,
                });
                console.log(newData, 'newData.index', response);
                setData(newData);
            }
        } catch (error) {
            console.error('Failed to update task status:', error);
            setData(originalData);
            // TODO: Show error message to user
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle task movement between columns
    const moveTask = (currentData: Column[], sourceColumnId: string, destColumnId: string, sourceIndex: number, destIndex: number) => {
        if (sourceColumnId === 'DONE') {
            return currentData
        }
        const newData = [...currentData];
        const sourceColumn = newData.find(col => col.id === sourceColumnId);
        const destColumn = newData.find(col => col.id === destColumnId);

        if (sourceColumn && destColumn) {
            const [movedTask] = sourceColumn.tasks.splice(sourceIndex, 1);
            destColumn.tasks.splice(destIndex, 0, movedTask);
        }
        return newData;
    };

    // Start editing the column title
    const startEditingColumnTitle = (columnId: string, currentTitle: string) => {
        setEditingColumnId(columnId);
        setEditingColumnTitle(currentTitle);
    };

    // Finish editing the column title and update the state
    const finishEditingColumnTitle = useCallback(() => {
        if (editingColumnId && editingColumnTitle.trim() !== '') {
            setData(prevData => prevData.map(col =>
                col.id === editingColumnId ? { ...col, title: editingColumnTitle.trim() } : col
            ));
            // TODO: call api to update status name on failure change the ui
        }
        setEditingColumnId(null);
    }, [editingColumnId, editingColumnTitle, setData]);

    // Handle clicks outside the editing input or options menu to save changes or close the menu
    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (editTitleRef.current && !editTitleRef.current.contains(event.target as Node)) {
            finishEditingColumnTitle();
        }
        if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
            setOpenOptionsTaskId(null);
        }
    }, [finishEditingColumnTitle]);

    // Add event listeners for detecting clicks outside of certain elements
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    // Toggle the visibility of the options menu for a task
    const toggleOptionsMenu = (taskId: string) => {
        setOpenOptionsTaskId(openOptionsTaskId === taskId ? null : taskId);
    };

    // Move a task to a different column
    const handleMoveTask = async (taskId: string, sourceColumnId: string, destColumnId: string, col_title) => {
        const sourceColumn = data.find(col => col.id === sourceColumnId);
        const taskIndex = sourceColumn?.tasks.findIndex(task => task.id === taskId) ?? -1;

        if (taskIndex !== -1) {
            const newData = moveTask(data, sourceColumnId, destColumnId, taskIndex, 0);
            const originalData = [...data];

            setIsLoading(true);
            try {
                const response = await patchQuestTasks({
                    'index': taskId,
                    'quest_name_and_agile_status': `${quest_id}#${destColumnId}`,
                });
                console.log(newData, 'newData.index', response);
                setData(newData);
            } catch (error) {
                console.error('Failed to move task:', error);
                setData(originalData);
                // TODO: Show error message to user
            } finally {
                setIsLoading(false);
            }
        }

        setOpenOptionsTaskId(null);
    };

    // Add a new task to a column
    const addNewTask = async (columnId: string) => {
        if (newTaskContent.trim() === '') return;

        // const newTask: Task = {
        //     id: Date.now().toString(),
        //     title: newTaskContent.trim(),
        // };

        const originalData = [...data];
        setIsLoading(true);

        try {
            const response = await postQuestTasks(quest_name, {
                'title': newTaskContent.trim(),
                'desceriprion': `{"time":1722625644255,"blocks":[{"id":"98GeseIIHO","type":"header","data":{"text":"${newTaskContent.trim()}","level":2}}],"version":"2.30.2"}`,
                'priority_or_is_complete': 'p1#false',
                'repeating_function_or_due_date': '',
                'quest_name_and_agile_status': `${quest_id}#${columnId}`,
                'updated_date': new Date().toISOString(),
                'created_date_and_due_date': new Date().toISOString(),
                'completion_skill': '',
                'delay_skills': ''
            });
            // print('', {})
            console.log('response-0-0-0-', response)
            var newTask = response.task
            newTask['id'] = newTask.index;
            setData(prevData =>
                prevData.map(column =>
                    column.id === columnId
                        ? { ...column, tasks: [...column.tasks, newTask] }
                        : column
                )
            );
            setNewTaskContent('');
            setAddingTaskToColumnId(null);
        } catch (error) {
            console.error('Failed to add new task:', error);
            setData(originalData);
            // TODO: Show error message to user
        } finally {
            setIsLoading(false);
        }
    };

    // Add a new column to the Kanban board
    const addNewColumn = () => {
        if (newColumnTitle.trim() === '') return;

        const newColumn: Column = {
            id: newColumnTitle.trim().toUpperCase(),
            title: newColumnTitle.trim().toUpperCase(),
            tasks: [],
        };

        setData(prevData => [...prevData, newColumn]);
        setNewColumnTitle('');
    };

    // Function to handle search term change for a column
    const handleSearchChange = (columnId: string, searchTerm: string) => {
        setColumnSearchTerms(prevTerms => ({
            ...prevTerms,
            [columnId]: searchTerm
        }));
    };

    // Function to filter tasks based on search term
    const filterTasks = (tasks: Task[], searchTerm: string) => {
        if (!searchTerm) return tasks;
        return tasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };
    const TaskCard: React.FC<{ task: Task; index: number; columnId: string, quest_id: string, quest_name: string }> = ({ task, index, columnId, quest_name, quest_id }) => {
        // console.log('=-0=-0=-0=00', task)
        const uncheckedItems = task.desceriprion.blocks.find((block: any) => block.type === 'checklist')?.data.items.filter((item: any) => !item.checked);

        return (
            <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                            userSelect: 'none',
                            padding: '16px',
                            margin: '0 0 8px 0',
                            backgroundColor: 'white',
                            position: 'relative',
                            ...provided.draggableProps.style
                        }}
                    >
                        <a href={`/add-task?task_id=${task.id}&quest_name=${encodeURIComponent(quest_name)}&quest_id=${quest_id}`}>{task.title}</a>
                        <p>{task.priority_or_is_complete.split('#')[0]}</p>
                        {uncheckedItems && uncheckedItems.length > 0 && (
                            <div>
                                <h4>Checklist:</h4>
                                <ul>
                                    {uncheckedItems.map((item: any, index: number) => (
                                        <li key={index}>{item.text}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div
                            style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                cursor: 'pointer',
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleOptionsMenu(task.id);
                            }}
                        >
                            ⋮
                        </div>
                        {openOptionsTaskId === task.id && (
                            <div
                                ref={optionsMenuRef}
                                style={{
                                    position: 'absolute',
                                    top: '25px',
                                    right: '5px',
                                    backgroundColor: 'white',
                                    border: '1px solid #ccc',
                                    borderRadius: '3px',
                                    padding: '5px',
                                    zIndex: 1000
                                }}
                            >
                                {data.filter(col => col.id !== columnId).map(col => (
                                    <div key={col.id} onClick={() => handleMoveTask(task.id, columnId, col.id, col.title)}>
                                        Move to {col.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </Draggable>
        );
    };
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div style={{
                display: 'flex',
                overflowX: 'auto',
                padding: '20px',
                height: 'calc(100vh - 40px)',
                opacity: isLoading ? 0.5 : 1,
                pointerEvents: isLoading ? 'none' : 'auto',
            }}>
                {data.map(column => (
                    <div key={column.id} style={{
                        background: '#f4f5f7',
                        borderRadius: '3px',
                        width: '300px',
                        marginRight: '20px',
                        padding: '8px',
                        flexShrink: 0,
                        height: 'fit-content',
                        maxHeight: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        {editingColumnId === column.id ? (
                            <input
                                ref={editTitleRef}
                                type="text"
                                value={editingColumnTitle}
                                onChange={(e) => setEditingColumnTitle(e.target.value)}
                                onBlur={finishEditingColumnTitle}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        finishEditingColumnTitle();
                                    }
                                }}
                                style={{
                                    fontSize: '1.5em',
                                    fontWeight: 'bold',
                                    width: '100%',
                                    marginBottom: '10px',
                                    padding: '5px',
                                }}
                                autoFocus
                            />
                        ) : (
                            <h2
                                onClick={() => startEditingColumnTitle(column.id, column.title)}
                                style={{ cursor: 'pointer' }}
                            >
                                {column.title}
                            </h2>
                        )}
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={columnSearchTerms[column.id] || ''}
                            onChange={(e) => handleSearchChange(column.id, e.target.value)}
                            style={{
                                width: '100%',
                                padding: '5px',
                                marginBottom: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '3px',
                            }}
                        />
                        <Droppable droppableId={column.id}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={{
                                        minHeight: '100px',
                                        maxHeight: 'calc(100vh - 250px)', // Adjusted for search input
                                        overflowY: 'auto'
                                    }}
                                >
                                    {filterTasks(column.tasks, columnSearchTerms[column.id] || '').map((task, index) => (
                                        <TaskCard key={task.id} task={task} index={index} columnId={column.id} quest_id={quest_id} quest_name={quest_name} />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        {addingTaskToColumnId === column.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={newTaskContent}
                                    onChange={(e) => setNewTaskContent(e.target.value)}
                                    placeholder="Enter task content"
                                    style={{ width: '100%', marginTop: '10px' }}
                                />
                                <button onClick={() => addNewTask(column.id)} style={{ marginTop: '5px' }}>Add Task</button>
                                <button onClick={() => setAddingTaskToColumnId(null)} style={{ marginTop: '5px', marginLeft: '5px' }}>Cancel</button>
                            </div>
                        ) : (
                            <button onClick={() => setAddingTaskToColumnId(column.id)} style={{ marginTop: '10px' }}>
                                Add New Task
                            </button>
                        )}
                    </div>
                ))}
                <div style={{
                    background: '#f4f5f7',
                    borderRadius: '3px',
                    width: '300px',
                    marginRight: '20px',
                    padding: '8px',
                    flexShrink: 0,
                    height: 'fit-content',
                }}>
                    <input
                        type="text"
                        value={newColumnTitle}
                        onChange={(e) => setNewColumnTitle(e.target.value)}
                        placeholder="Enter new column title"
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                    <button onClick={addNewColumn}>Add New Column</button>
                </div>
            </div>
            {isLoading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '24px',
                    fontWeight: 'bold',
                }}>
                    Loading...
                </div>
            )}
        </DragDropContext>
    );
};

export default Kanban;