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
  "databaseName": "database-name",
  "databaseURL": "database-url",
  "OpenAIKey": "openai-key"
}
```
The whitelist list is only necessary for bypassing protected commands flagged with *in-dev*.  
To add a user to this whitelist, insert their ``"USERID"`` into the list.

## Database Setup
Calabash supports only **MongoDB**
- 1. Initialize your Mongo instance
- 2. Create the _warnings_ and _scheduled_ containers
- 3. Ensure you enter your database name into the configuration file.

## Command Tweaking
Some commands contain flags in their ``.js`` files such as _inDev_, _disabled_, and _commandType_.

- **inDev**: [boolean] [Limits command usage to users specified in the ``whitelist``]
- **disabled**: [boolean] [Disables the command entirely]
- **commandType**: [String] [Accepts the parameter _moderation_ currently, locking the command to users with the moderation role assigned in the ``config.json``]

``index.js`` acts as the main file. Executing it will intialize your guild commands and the bot.