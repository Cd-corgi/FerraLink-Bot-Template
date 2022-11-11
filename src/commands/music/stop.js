const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.Connect],
    inVoiceChannel: true,
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stops the queue and make the bot left the channel!"),
    async run(client, interaction) {
        const player = await client.manager.players.get(interaction.guild.id);

        if(!player) return interaction.reply({
            content: `There's no songs to stop!`,
            ephemeral: true
        })

        player.loop = "none"
        player.queue.clear();
        player.destroy();

        await interaction.deferReply()
        interaction.followUp(`⏹ I stopped the queue!`)
    }
}