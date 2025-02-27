require('dotenv').config();  // Charger les variables d'environnement
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
const port = 3000;
const discordToken = process.env.TOKEN_DISCORD;

// Créer un nouveau client de bot Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,  // Permet d'accéder aux membres de la guilde
  ],
});

// Quand le bot est prêt
client.once('ready', async () => {
  console.log(`${client.user.tag} est prêt !`);
  
  // Remplacez "guildId" par l'ID de ta guilde (serveur Discord)
  const guild = await client.guilds.fetch(process.env.GUILD_ID);
  
  // Récupérer tous les membres de la guilde
  const members = await guild.members.fetch();

  // Filtrer les administrateurs
  const admins = members.filter(member => member.roles.cache.has(process.env.ADMIN_ID));

  // Afficher les administrateurs
  console.log('Administrateurs de la guilde :');
  admins.forEach(admin => {
    console.log(admin.user.tag);  // Affiche le nom d'utilisateur de chaque administrateur
  });
});

// Se connecter au bot
client.login(discordToken);

// Route pour récupérer les membres de la guilde
app.get('/members', async (req, res) => {
  try {
    // Remplacez "guildId" par l'ID de ta guilde (serveur Discord)
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const members = await guild.members.fetch();

    // Retourner les membres en format JSON
    res.json(members.map(member => ({
      id: member.id,
      username: member.user.username,
      nickname: member.nickname || 'Aucun Surnom',
      tag: member.user.tag,
      roles: member.roles.cache.map(role => role.name),  // Les rôles du membre
    })));
  } catch (error) {
    console.error('Erreur lors de la récupération des membres :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Démarrer le serveur Express
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
