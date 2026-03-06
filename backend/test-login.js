const axios = require('axios');

async function testLogin() {
    try {
        const res = await axios.post('https://medicore-api.onrender.com/api/auth/login', {
            email: 'mithunramesh15122003@gmail.com',
            password: 'Medicore@123'
        });
        console.log(res.data);
    } catch (err) {
        console.error(err.response ? err.response.data : err.message);
    }
}
testLogin();
