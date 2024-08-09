import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

// Define the Task interface
interface Task {
    id: string;
    content: string;
}

// Define the Column interface
interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

// Define the KanbanProps interface
interface KanbanProps {
    initialData: Column[];
}

// Kanban component
const Kanban: React.FC<KanbanProps> = ({ initialData }) => {
    // State to store columns data
    const [columns, setColumns] = useState<Column[]>(initialData);
    const [newTaskContent, setNewTaskContent] = useState<string>(''); // State to store new task content
    const [newColumnTitle, setNewColumnTitle] = useState<string>(''); // State to store new column title
    const [activeTaskMenu, setActiveTaskMenu] = useState<string | null>(null); // State to manage active task menu
    const containerRef = useRef<HTMLDivElement>(null); // Ref for the container
    const menuRef = useRef<HTMLDivElement>(null); // Ref for the menu

    // Function to handle drag end event
    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        // If dropped outside the list
        if (!destination) {
            return;
        }

        // If dropped in the same position
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        // Find the source and destination columns
        const sourceColumn = columns.find(col => col.id === source.droppableId);
        const destColumn = columns.find(col => col.id === destination.droppableId);

        if (sourceColumn && destColumn) {
            // Clone the source and destination tasks
            const sourceTasks = Array.from(sourceColumn.tasks);
            const destTasks = source.droppableId === destination.droppableId
                ? sourceTasks
                : Array.from(destColumn.tasks);

            // Remove the task from source and add to destination
            const [removed] = sourceTasks.splice(source.index, 1);
            destTasks.splice(destination.index, 0, removed);

            // Update the columns state with the new task orders
            const newColumns = columns.map(col => {
                if (col.id === source.droppableId) {
                    return { ...col, tasks: sourceTasks };
                }
                if (col.id === destination.droppableId) {
                    return { ...col, tasks: destTasks };
                }
                return col;
            });

            setColumns(newColumns);
        }
    };

    // Function to add a new task to a column
    const addTask = (columnId: string) => {
        if (newTaskContent.trim() === '') return;

        const newTask: Task = {
            id: `task-${Date.now()}`,
            content: newTaskContent,
        };

        const newColumns = columns.map(col => {
            if (col.id === columnId) {
                return { ...col, tasks: [...col.tasks, newTask] };
            }
            return col;
        });

        setColumns(newColumns);
        setNewTaskContent('');
    };

    // Function to add a new column
    const addColumn = () => {
        if (newColumnTitle.trim() === '') return;

        const newColumn: Column = {
            id: `column-${Date.now()}`,
            title: newColumnTitle,
            tasks: [],
        };

        setColumns([...columns, newColumn]);
        setNewColumnTitle('');
    };

    // Function to move a task to another column
    const moveTask = (taskId: string, sourceColumnId: string, targetColumnId: string) => {
        const newColumns = columns.map(column => {
            if (column.id === sourceColumnId) {
                // Remove task from source column
                return {
                    ...column,
                    tasks: column.tasks.filter(task => task.id !== taskId)
                };
            }
            if (column.id === targetColumnId) {
                // Add task to target column
                const taskToMove = columns
                    .find(col => col.id === sourceColumnId)?.tasks
                    .find(task => task.id === taskId);
                if (taskToMove) {
                    return {
                        ...column,
                        tasks: [...column.tasks, taskToMove]
                    };
                }
            }
            return column;
        });
        setColumns(newColumns);
        setActiveTaskMenu(null); // Close the menu after moving
    };

    // Function to handle clicking outside the menu
    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setActiveTaskMenu(null);
        }
    }, []);

    // Add click event listener to handle clicks outside the menu
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div
                ref={containerRef}
                style={{
                    display: 'flex',
                    overflowX: 'auto',
                    overflowY: 'hidden', // Hide vertical scrollbar
                    padding: '20px',
                    height: 'calc(100vh - 40px)', // Adjust height to fit viewport
                }}
            >
                {columns.map(column => (
                    <div key={column.id} style={{
                        background: '#f4f5f7',
                        borderRadius: '3px',
                        width: '300px',
                        marginRight: '20px',
                        padding: '8px',
                        flexShrink: 0,
                        height: '100%',
                        overflowY: 'auto', // Enable vertical scroll for each column
                    }}>
                        <h2>{column.title}</h2>
                        <Droppable droppableId={column.id}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={{ minHeight: '100px' }}
                                >
                                    {column.tasks.map((task, index) => (
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
                                                    {task.content}
                                                    <button
                                                        style={{
                                                            position: 'absolute',
                                                            right: '5px',
                                                            top: '5px',
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent event from bubbling up
                                                            setActiveTaskMenu(activeTaskMenu === task.id ? null : task.id);
                                                        }}
                                                    >
                                                        ⋮
                                                    </button>
                                                    {activeTaskMenu === task.id && (
                                                        <div
                                                            ref={menuRef}
                                                            style={{
                                                                position: 'absolute',
                                                                right: '0',
                                                                top: '20px',
                                                                background: 'white',
                                                                border: '1px solid #ccc',
                                                                borderRadius: '3px',
                                                                zIndex: 1000
                                                            }}
                                                        >
                                                            {columns.filter(col => col.id !== column.id).map(col => (
                                                                <button
                                                                    key={col.id}
                                                                    onClick={() => moveTask(task.id, column.id, col.id)}
                                                                    style={{
                                                                        display: 'block',
                                                                        width: '100%',
                                                                        padding: '5px 10px',
                                                                        textAlign: 'left',
                                                                        border: 'none',
                                                                        background: 'none',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    Move to {col.title}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <div style={{ marginTop: '16px' }}>
                            <input
                                type="text"
                                value={newTaskContent}
                                onChange={(e) => setNewTaskContent(e.target.value)}
                                placeholder="New task"
                                style={{ width: '70%', marginRight: '8px', padding: '4px' }}
                            />
                            <button onClick={() => addTask(column.id)} style={{ padding: '4px 8px' }}>
                                Add Task
                            </button>
                        </div>
                    </div>
                ))}
                <div style={{
                    background: '#f4f5f7',
                    borderRadius: '3px',
                    width: '300px',
                    padding: '8px',
                    flexShrink: 0,
                }}>
                    <h2>Add New Column</h2>
                    <input
                        type="text"
                        value={newColumnTitle}
                        onChange={(e) => setNewColumnTitle(e.target.value)}
                        placeholder="New column title"
                        style={{ width: '70%', marginRight: '8px', padding: '4px' }}
                    />
                    <button onClick={addColumn} style={{ padding: '4px 8px' }}>
                        Add Column
                    </button>
                </div>
            </div>
        </DragDropContext>
    );
};

export default Kanban;
