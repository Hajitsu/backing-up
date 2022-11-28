# BackUp From Everything With #ShellScript

**Story of the project**

Hi! I'm [Hajitsu](https://github.com/Hajitsu/).
In the office, we have servers to do our work. On one of the servers, Gitlab-CE is installed to manage our repositories. I have a concern about backup repositories per day. So I deployed a bash script to backup repositories and upload it to Telegram's private channel.
Because of the banned Telegram in Iran, I have to develop an API to upload files by the bash script to it, and then the API sends it to Telegram's private channel. The API is on VPS in Finland.
I also decided to deploy these scripts to backup from our files on Windows Server or PFSense.


# Shell Script
**Gitlab**
to use the script to backup Gitlab-CE, first, create a config file `.git-backup.config` in the root of the `shell-script` folder like this:
```
destination_share=/media/GitBackup
temp_path=/home/USERNAME/temp
seperate_size=20m
api_url=http://VPS_IP:PORT/dep/git
```
**Notice**
> by `destination_share,`, you can copy a backup file to a shared folder.

>Because of Telegram limitations, the bot upload document limitation is 20M (`seperate_size`).

# Node JS API
To use NodeJS API, you have to create a `.env` file in the root of the project like this:
```
BOT_ID=XXXXXXXX
CHAT_ID=XXXXXXX
```

# Recommendation
to start the API, you can use [PM2](https://pm2.keymetrics.io) by `pm2 start app.js` command.
