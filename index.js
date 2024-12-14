const { Client: c, GatewayIntentBits: g, EmbedBuilder: e } = require('discord.js');
const axios = require('axios');
const { token: t } = require('./config.json');

const u = new c({ intents: [g.Guilds, g.GuildMessages, g.MessageContent, g.GuildMembers] });

u.once('ready', () => {
    console.log(`Logged in as ${u.user.tag}`);

    // Change the bot's "About Me" every 10 seconds
    setInterval(async () => {
        try {
            const response = await axios.patch(
                'https://discord.com/api/v10/users/@me',
                { bio: 'Funky 😛' }, // Update this string to change the bot's About Me
                { headers: { Authorization: `Bot ${t}` } }
            );

            if (response.status === 200) {
                console.log('About Me updated to "Funky 😛"');
            } else {
                console.error('Error updating About Me:', response.status, response.data);
            }
        } catch (error) {
            console.error('Error updating About Me:', error.response ? error.response.data : error.message);
        }
    }, 10000); // 10 seconds interval
});

// Trigger when someone joins the server
u.on('guildMemberAdd', m => {
    const channel = m.guild.channels.cache.get('1317374652959690782'); // Replace with your channel ID
    if (!channel) return; // If channel is not found, return

    const embed = new e()
        .setColor('#000000')
        .setTitle(`Welcome ${m.user.username} to ${m.guild.name}`)
        .setDescription(`Welcome to the server, <@${m.user.id}>!`) // This pings the user in the embed too
        .setThumbnail(m.guild.iconURL())
        .setImage(m.user.displayAvatarURL())
        .addFields(
            { name: '𝐆𝐞𝐭 𝐑𝐨𝐥𝐞𝐬', value: '<#1296124854298349618>', inline: true },
            { name: '𝐑𝐞𝐚𝐝 𝐑𝐮𝐥𝐞𝐬', value: '<#1296083209456717916>', inline: true },
            { name: '𝐒𝐚𝐲 𝐇𝐞𝐥𝐥𝐨', value: '<#1316078607919218699>', inline: true }
        );

    // Mention the user first, then send the embed
    channel.send(`<@${m.user.id}>`).then(() => {
        channel.send({ embeds: [embed] });
    }).catch(console.error);
});

// Trigger the same logic on command
u.on('messageCreate', m => {
    if (m.content.toLowerCase() === '!testgreet') {
        const embed = new e()
            .setColor('#000000')
            .setTitle(`Welcome ${m.author.username} to ${m.guild.name}`)
            .setDescription(`Welcome to the server, <@${m.author.id}>!`) // Pings the user in the embed
            .setThumbnail(m.guild.iconURL())
            .setImage(m.author.displayAvatarURL())
            .addFields(
                { name: '𝐆𝐞𝐭 𝐑𝐨𝐥𝐞𝐬', value: '<#1296124854298349618>', inline: true },
                { name: '𝐑𝐞𝐚𝐝 𝐑𝐮𝐥𝐞𝐬', value: '<#1296083209456717916>', inline: true },
                { name: '𝐒𝐚𝐲 𝐇𝐞𝐥𝐥𝐨', value: '<#1296090868985626644>', inline: true }
            );

        // Mention the user first, then send the embed
        m.channel.send(`<@${m.author.id}>`).then(() => {
            m.channel.send({ embeds: [embed] });
        }).catch(console.error);
    }
});

u.login(t).catch(e => console.error('Error logging in:', e));
