import axios from 'axios'

export async function insertClassroom(data, callback) {
    await axios.post('/api/insertClassroom',
        data, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function(response) {
        console.log(response);
        callback(response.data)
    });
}

export async function getAllClassroom() {
    let response = await axios.post('/api/getAllClassroom',
        {
        headers: {
            "Content-Type": "application/json"
        }
    })
    return response.data
}