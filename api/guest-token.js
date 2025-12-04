import fetch from 'node-fetch';

export default async function handler(req, res) {
    const clientId = '9049e4208b1c4f81a80a3b03948b30e9';
    const clientSecret = 'fb9fd4b4bb044699965318faac6311b4';

    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    const data = await tokenRes.json();
    res.status(200).json(data);
}
