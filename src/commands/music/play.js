const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.Connect],
    inVoiceChannel: true,
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play music in a Voice Channel")
        .addStringOption(option =>
            option
                .setName("query")
                .setDescription("Provide the name or URL of the song")
                .setRequired(true)
        ),
    async run(client, interaction) {
        const query = interaction.options.getString("query")
        const player = await client.manager.createPlayer({
            guildId: interaction.guild.id,
            textId: interaction.channel.id,
            voiceId: interaction.member.voice.channel.id,
            shardId: interaction.guild.shardId,
            deaf: true
        })

        let resolve = await client.manager.search(query, { engine: "spsearch" })

        const { loadType, tracks, playlistInfo } = resolve;

        if (loadType === "NO_MATCHES" || !tracks.length) return interaction.reply(`No Matches Found!`)

        if (loadType === "PLAYLIST_LOADED") {
            for (const track of tracks) {
                player.queue.add(track)
                track.info.requester = interaction.user;
            }
            if (!player.playing && !player.paused) await player.play();
            await interaction.deferReply()
            interaction.followUp(`Adding Playlist \`${playlistInfo.name}\``)
        }

        if (loadType === "SEARCH_RESULT" || loadType === "TRACK_LOADED") {
            await player.queue.add(tracks[0])
            tracks[0].info.requester = interaction.user;
            if (!player.queue.current && !player.paused) await player.play();
            await interaction.deferReply()
            interaction.followUp(`Adding \`${tracks[0].info.title}\``)
        }
    }
}