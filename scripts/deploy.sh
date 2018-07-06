#/bin/sh

# Update new code
git pull 

# install new modules
npm install

# Compile source typescript
tsc

# Restart pm2
if [ $1 ]; then
	echo $1
    npm run $1
fi

if [ $2 ]; then
	echo $2
    npm run $2
fi

