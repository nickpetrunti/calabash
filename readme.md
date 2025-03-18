# Calabash

## Quickstart
In order to get the bot running, you must first create a *config.json* in the root directory.  
The format for the file is the following:  
```json 
{
  "Token": "TOKEN",
  "clientID": "APPLICATION ID",
  "guildID": "GUILD ID",
  "warnLogsID": "WARNING CHANNEL ID",
  "whitelist": []
}
```
The whitelist list is only necessary for bypassing protected commands flagged with *in-dev*.  
To add a user to this whitelist, just insert ``"USERID"`` into the list.  

**BEFORE STARTING THE BOT** ensure you run ``node handler.js`` to register all the commands with your guild.  

To start the bot run ``node index.js``