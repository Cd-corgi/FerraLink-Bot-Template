const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');
const { format } = require('../../util/function')

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.Connect],
    inVoiceChannel: true,
    data: new SlashCommandBuilder()
        .setName("now-playing")
        .setDescription("Check what is the song playing right now!"),
    async run(client, interaction) {
        const player = await client.manager.players.get(interaction.guild.id);

        if (!player || !player.queue.current) {
            await interaction.deferReply({ ephemeral: true })
            return interaction.followup(`There's not songs playing!`)
        }

        await interaction.deferReply();
        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Now Playing ...`)
                    .addFields(
                        { name: "📀 Song Title", value: `\`${player.queue.current.info.title}\` | ${player.queue.current.info.isStream ? "🔴 LIVE": `\`${format(player.queue.current.info.length)}\``}` },
                        { name: "Requester", value: `${player.queue.current.info.requester}` }
                    )
                    .setColor("Green")
            ]
        })
    }
}