// src/api.ts

import axios from 'axios';
// import { Item } from './types';

const API_URL = 'https://script.google.com/macros/s/AKfycbwJOnpWWW6rDGyNuP4bAKVzIZTLsBH6q77QJCiO_5MIiXN1v0CW80Vr0U0ZU-lFU01q/exec'; // Replace with your API URL

export const getQuestTasks = async (quest) => {
    const response = await axios.get(
        API_URL,
        {
            params: {
                'quest': quest,
                'action': "quest_tasks",
            }
        }
    );
    return response.data;
};
export const postQuestTasks = async (quest, data) => {
    const params = {
        'quest': quest,
        'action': "quest_tasks",
    }
    try {
        const response = await axios({
            method: 'post',
            url: API_URL,
            params: params,
            data: data,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }

};

export const patchQuestTasks = async (data) => {
    const params = {
        'action': "patch_quest_tasks",
    }
    try {
        const response = await axios({
            method: 'post',
            url: API_URL,
            params: params,
            data: data,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }

};

export const getTask = async (index) => {
    const response = await axios.get(
        API_URL,
        {
            params: {
                'index': index,
                'action': "task",
            }
        }
    );
    return response.data;
};
export const getMjorSkills = async () => {
    const response = await axios.get(
        API_URL,
        {
            params: {
                'action': "major_skills",
            }
        }
    );
    return response.data;
};
export const getMinorSkills = async (major_skill) => {
    console.log('getting minor skills', major_skill)
    const response = await axios.get(
        API_URL,
        {
            params: {
                'major_skill': `${major_skill}`,
                'action': "minor_skills",
            }
        }
    );
    return response.data;
};

export const getQuests = async (is_done) => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                'action': 'quests',
                'is_done': is_done
            }
        });
        if (response.data[0] == '') {
            return []
        }
        // Assuming response.data is an array of arrays, you can use map for transformation
        const op = response.data.map(row_data => ({
            'index': row_data[0],
            'title': row_data[1],
            'description': row_data[2],
            'priority_or_is_complete': row_data[3],
            'repeating_function_or_due_date': row_data[4],
            'quest_name_and_agile_status': row_data[5],
            'updated_date': row_data[6],
            'created_date_and_due_date': row_data[7],
            'completion_skill': row_data[8],
            'delay_skills': row_data[9]
        }));

        console.log(op, response.data);
        return op;
    } catch (error) {
        console.error('Error fetching quests:', error);
        return [];
    }
};

export const getTaskList = async () => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                'action': 'tasks',
            }
        });
        console.log("called: ", response.data)
        var op = {}
        // Modify the daily_data as needed
        op['daily_data'] = response.data['daily_data'].map(row_data => [
            ...row_data.slice(0, 2), // First two elements
            JSON.parse(row_data[2]), // Convert the third element to JSON string
            ...row_data.slice(3) // Rest of the elements
        ]);
        op['today_data'] = response.data['today_data'].map(row_data => [
            ...row_data.slice(0, 2), // First two elements
            JSON.parse(row_data[2]), // Convert the third element to JSON string
            ...row_data.slice(3) // Rest of the elements
        ]);
        op['weekly_data'] = response.data['weekly_data'].map(row_data => [
            ...row_data.slice(0, 2), // First two elements
            JSON.parse(row_data[2]), // Convert the third element to JSON string
            ...row_data.slice(3) // Rest of the elements
        ]);
        op['monthly_data'] = response.data['monthly_data'].map(row_data => [
            ...row_data.slice(0, 2), // First two elements
            JSON.parse(row_data[2]), // Convert the third element to JSON string
            ...row_data.slice(3) // Rest of the elements
        ]);
        console.log('op', op)

        // Return the updated data with the modified weekly_data
        return op;
    } catch (error) {
        console.error('Error fetching quests:', error);
        return [];
    }
};

export const getProfile = async () => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                'action': 'profile',
            }
        });
        console.log("called: ", response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching quests:', error);
        return {};
    }
};

export const getSubTask = async (major_skill) => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                'action': 'subtask_by_major_skill',
                'major_skill': major_skill
            }
        });
        console.log("called: ", response.data)
        return response.data

    } catch (error) {
        console.error('Error fetching quests:', error);
        return [];
    }
};