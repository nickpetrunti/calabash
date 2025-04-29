# Calabash

## Quickstart
In order to get the bot running, you must first create a *config.json* in the root directory.  
The format for the file is the following:  
```json 
{
  "Token": "client-token",
  "clientID": "client-id",
  "guildID": "guild-id",
  "moderatorRoleID": "moderator-role-id",
  "warnLogsID": "warning-log-channel-id",
  "whitelist": ["user-id"],
  "databaseURL": "database-url",
  "OpenAIKey": "openai-key"
}
```
The whitelist list is only necessary for bypassing protected commands flagged with *in-dev*.  
To add a user to this whitelist, insert their ``"USERID"`` into the list.  

## Database Setup
Calabash supports only **MongoDB**. 

To start the bot run ``node index.js``