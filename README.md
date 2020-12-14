<h1 align="center">Welcome to travel5 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.0-blue.svg?cacheSeconds=2592000" />
</p>

## Install

```sh
npm install
```

## Usage

```sh
npm run start
```

## Deploy to production

If any change in .env file :
```sh
1. Open .env file, nano .env
2. Change .env variable
3. Save .env file
```

```sh
1. ssh to prod server ( ssh -i <path to ssh file> ubuntu@54.163.242.157)
2. docker stop $(docker ps -a -q)
3. docker rm $(docker ps -a -q)
4. docker run --env-file=.env -d -p  3000:3000 hanifadzkiya/travel:0.1.<nomor circle ci>
```

## Directory Structure
Node JS Project Structure : https://softwareontheroad.com/ideal-nodejs-project-structure/

    src
    | app.js                   # App entry point
    ├── api                    # Express route controllers for all the endpoints of the app
    ├── config                 # Environment variables and configuration related stuff
    ├── models                 # Database models
    ├── services               # All the business logic is here
    ├── LICENSE
    └── README.md

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_

## Contributor
1. Antyka Syahrial
2. Hilman Abdan
3. Muhammad Hanif Adzkiya
4. Rival Fauzi
