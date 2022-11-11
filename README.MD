<center>

# How To Make your own music Discord Bot

</center>

Install the package:

```
npm i ferra-link
```

> 📹 Video Guide: [Youtube Tutorial](https://youtu.be/1CH7JekBITo)

If you want to customizate your Music Messages or knowing about to FerraLink's Events. Go to [FerraLink Docs](https://ferralink.gitbook.io/docs/)

**Config.json Template**

_Keep in mind that you have to fill the `node` part. Because it is important to make the Music System works properly_

```json
{
    "token": "BOT TOKEN HERE",
    "botID": "BOT ID HERE",
    "mongoose": "MONGOOSE URI HERE (OPTIONAL)",
    "node": [
        {
            "name": "Lavalink Server",
            "url": "Your Hosting url:port",
            "auth": "password",
            "secure": false
        }
    ],
    "clientId": "SPOTIFY CLIENT ID",
    "clientSecret": "SPOTIFY SECRET CLIENT"
}
```

# ⚠ Caution

If you don't want to get a trouble starting the bot without mongoose connection, remove from Index.js:

```diff
# index.js

- require('./src/utils/mongoose')();

# console

+ npm uninstall mongoose
```
