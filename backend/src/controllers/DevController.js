const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },
    async store (request, response) {
        try {
            const { github_username, techs, latitude, longitude } = request.body;

            let dev = await Dev.findOne({ github_username });
            if (dev) {
                return response.json(dev)
            }

            const techsArray = techs.split(',').map(tech => tech.trim());
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            const apiResonse = await axios.get(`https://api.github.com/users/${github_username}`)

            const { name = login, avatar_url, bio } = apiResonse.data;

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })

            return response.json(dev)
        } catch(e) {
            response.statusCode = 400;

            return response.json({
                error: true,
                message: 'Algum erro ocorreu.'
            });
        }
    }
};
