const axios = require('axios');

const token = process.env.TOKEN_DISCORD;
const guildId = process.env.GUILD_ID;
const rolesId = process.env.ADMIN_ID;

async function getAdminRoles() {
    try {
        const rolesResponse = await axios.get(`https://discord.com/api/v10/guilds/${guildId}/members`, {
           headers: {
            Authorization: `Bot ${token}`
           }
        });

        const adminMembers = rolesResponse.data.filter(member => member.permissions.includes(rolesId));
    } catch (error) {
        console.error('Erreur lors de la récupération des rôles :', error);
    }
}

module.exports = getAdminRoles;