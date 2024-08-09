export const print = (title = '#', params = {}) => {
    try {
        let s = '';
        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                try {
                    s += `${key}=${JSON.stringify(params[key])},\n`;
                } catch (jsonError) {
                    console.warn(`Error stringifying value for key "${key}":`, jsonError);
                    s += `${key}=[Unstringifiable value],\n`;
                }
            }
        }
        s += '\n';
        console.log(title + '\n', s.slice(0, -2)); // Remove the last comma and newline
    } catch (error) {
        console.error('An error occurred in the print function:', error);
    }
}