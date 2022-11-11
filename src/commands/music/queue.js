const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');
const { format } = require('../../util/function')

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect],
    inVoiceChannel: true,
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Check the following songs added in the queue"),
    async run(client, interaction) {
        const player = client.manager.players.get(interaction.guild.id)
        await interaction.deferReply()

        if (!player || !player.queue.current) return interaction.followUp(`❌ No songs playing right now!`)

        let songs = []

        player.queue.map((v, i) => {
            songs.push(`\`${i + 1}\` - \`${v.info.title}\` - \`${format(v.info.length)}\``)
        })

        if (songs.length < 1) {
            return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${interaction.guild.name}\'s Queue`)
                        .setDescription(`📀 **Now Playing:**\n\`${player.queue.current.info.title}\` - \`${format(player.queue.current.info.length)}\``)
                ]
            })
        }

        songs = songs.slice(0, 10)

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${interaction.guild.name}\'s Queue`)
                    .setDescription(`📀 **Now Playing:**\n\`${player.queue.current.info.title}\` - \`${format(player.queue.current.info.length)}\`\n**Following Songs:**\n${songs.join("\n")}`)
            ]
        })
    }
}