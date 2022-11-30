#! /bin/bash

script=$(readlink -f "$0")
script_path=$(dirname "$script")

echo `date +"%Y-%m-%d %T"`: reading configurations
. $script_path/.git-backup.config

echo "**************"

echo `date +"%Y-%m-%d %T"`: $destination_share
echo `date +"%Y-%m-%d %T"`: $temp_path
echo `date +"%Y-%m-%d %T"`: $seperate_size
echo `date +"%Y-%m-%d %T"`: $api_url

echo "**************"

echo `date +"%Y-%m-%d %T"`: creating backup
gitlab-rake gitlab:backup:create

echo "**************"

echo `date +"%Y-%m-%d %T"`: start copy file to share
cp /var/opt/gitlab/backups/*gitlab_backup.tar $destination_share
echo "**************"
echo `date +"%Y-%m-%d %T"`: start copy file to temp
mv /var/opt/gitlab/backups/*gitlab_backup.tar $temp_path
file_path=$(ls $temp_path/*gitlab_backup.tar | head -1)
echo `date +"%Y-%m-%d %T"`: $file_path
chown root:root $file_path
chmod +x $file_path

zip_file_path=$temp_path/$(date '+%Y-%m-%d').zip
echo "**************"
echo `date +"%Y-%m-%d %T"`: start zip and seperate file to $seperate_size
zip -s $seperate_size $zip_file_path $file_path
rm $zip_file_path
echo `date +"%Y-%m-%d %T"`: remove $zip_file_path
rm $file_path
echo `date +"%Y-%m-%d %T"`: remove $file_path

echo "**************"
echo `date +"%Y-%m-%d %T"`: start uploading to telegram  channel...

while true
do
	if [ "$(ls -A $temp_path)" ];
	then
		file=$(ls $temp_path/* | head -1)
		echo `date +"%Y-%m-%d %T"`: uploading $file
		status_code=$(curl \
						--output /dev/null --silent --write-out %{http_code} \
						-X POST \
						--form file=@$file \
						$api_url)
		echo `date +"%Y-%m-%d %T"`: status code: $status_code
		if [ "$status_code" = "200" ];
		then
			rm $file
			echo `date +"%Y-%m-%d %T"`: remove $file
		else
			echo `date +"%Y-%m-%d %T"`: failed to upload $file, trying again
		fi
	else
		echo `date +"%Y-%m-%d %T"`: all files uploaded.
		exit 0
	fi
	echo "**************"
done