const Discord = require('discord.js')
const client = new Discord.Client({
    intents: 130815
})
const fs = require('fs')
const { FerraLink } = require('ferra-link')
const { token, botID, node } = require('./src/config/config.json')
const { format } = require('./src/util/function')

client.commands = new Discord.Collection();
client.manager = new FerraLink(client, node);

fs.readdir("./src/events/client", (err, files) => {
    if (err) console.error;
    files.forEach((ff) => {
        if (!ff.endsWith(".js")) return;
        let eName = ff.split(".")[0]
        const events = require(`./src/events/client/${ff}`)
        client.on(eName, events.bind(null, client))
        console.log(`${eName} Loaded!`)
    })
})

fs.readdirSync(`./src/commands`).forEach(category => {
    let file = fs.readdirSync(`./src/commands/${category}`).filter(f => f.endsWith(".js"))
    for (const command0s of file) {
        let cmd = require(`./src/commands/${category}/${command0s}`)
        client.commands.set(cmd.data.name, cmd)
    }
})

// Ferralink events

let ferralink = client.manager;

ferralink.shoukaku.on("ready", (name) => {
    console.log(`${name} Connected`)
})

ferralink.on("trackStart", (player, track) => {
    let chan = client.channels.cache.get(player.textId);
    chan.send({
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle("Now Playing ...")
                .addFields(
                    { name: "📀 Song Title", value: `\`${track.info.title}\`  \`${format(track.info.length)}\``, inline: true },
                    { name: "Requester", value: `${track.info.requester}`, inline: true },
                    { name: "Author", value: `${track.info.author}` }
                )
                .setFooter({ text: `Source: ${track.info.sourceName}` })
        ]
    })
})

postSlash(token, botID);

client.login(token).catch(err => { console.log(err) })

function postSlash(btoken, bid) {
    const commands = []
    fs.readdirSync(`./src/commands`).forEach(category => {
        let file = fs.readdirSync(`./src/commands/${category}`).filter(f => f.endsWith(".js"))
        for (const command0s of file) {
            let cmd = require(`./src/commands/${category}/${command0s}`)
            commands.push(cmd.data.toJSON())
        }
    })
    const rest = new Discord.REST({ version: "10" }).setToken(btoken)
    postSlash();
    async function postSlash() {
        try {
            await rest.put(Discord.Routes.applicationCommands(bid), { body: commands })
            console.log("All commands pushed!")
        } catch (error) {
            console.error;
        }
    }
}