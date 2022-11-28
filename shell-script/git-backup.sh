#! /bin/bash

# reading configurations
. ./.git-backup.config

gitlab-rake gitlab:backup:create
cp /var/opt/gitlab/backups/*gitlab_backup.tar $destination_share
mv /var/opt/gitlab/backups/*gitlab_backup.tar $temp_path
file_path=$(ls $temp_path/*gitlab_backup.tar | head -1)
echo $file_path
chown root:root $file_path
chmod +x $file_path

zip_file_path=$temp_path/$(date '+%Y-%m-%d').zip
zip -s $seperate_size $zip_file_path $file_path
rm $zip_file_path
rm $file_path


echo "uploading to telegram  channel..."

while true
do
	if [ "$(ls -A $temp_path)" ]; 
	then
		file=$(ls $temp_path/* | head -1)
		echo "\n uploading $file"
		status_code=$(curl \
						--output /dev/null --silent --write-out %{http_code} \
						-X POST \
						--form file=@$file \
						$api_url)
		echo "\n status code: $status_code"
		if [ "$status_code" = "200" ];
		then
			rm $file
		else
			"failed to upload $file, trying again"
		fi
	else
			echo "all files uploaded."
	return
	fi
done