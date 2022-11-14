//import fetch from 'node-fetch'
const fetch = require('node-fetch');

exports.handler = async (event) => {
    console.log('Starting add comment.', JSON.stringify(event, null, 2));
    try {
        const res = await fetch('https://randomuser.me/api');
        const resJson = await res.json();

        console.log('api response 👉', JSON.stringify(resJson, null, 4));
        return {body: JSON.stringify(resJson), statusCode: 200};
    } catch (error) {
        console.error(`ERROR:`, JSON.stringify(error, null,2))
        return {body: JSON.stringify({error})};
    }

};
