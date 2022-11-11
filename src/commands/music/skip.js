const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.Connect],
    inVoiceChannel: true,
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("You can skip the current song to the enxt one!"),
    async run(client, interaction) {
        const player = await client.manager.players.get(interaction.guild.id)

        if (!player || !player.queue.current) return interaction.reply({
            content: `There's no songs playing right now!`,
            ephemeral: true
        })

        if (player.queue.length < 1) return interaction.reply(`⚠ There's no following songs to skip!`)

        player.skip()

        await interaction.deferReply()
        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`⏩ Skipping...`)
            ]
        }).then(() => setTimeout(() => interaction.deleteReply(), 5000)).catch(err => { })
    }
}