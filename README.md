# NFL-odds
NodeJS/Docker - An application to view odds of upcoming NFL matches

This is a slightly updated version of my boxing odds application I created at university in 2019.

The API site used:
* Sports Odds API - https://the-odds-api.com/

The following tools were used:
* NPM
* Javascript
* HTML/Pug
* Bootstrap/CSS
* Docker

A 1 minute demonstration video of the application: https://youtu.be/Jas5BfiXPUY

## User Guide:
After cloning this repository, the application can be run using npm or docker:

NPM:
1. Install the dependencies:
```bash
npm init
```
2. Run the npm server:
```bash
npm start
```
3. Navigate to localhost:3000 in a web browser

Docker:
1. Build the Dockerfile:
```bash
docker build -t boxing-odds .
```
2. Start the project:
```bash
docker run -p 80:3000 boxing-odds
```
3. Navigate to locahost in a web browser

The docker project is available on my private repository on dockerhub. It can be pulled from that repository using the following command:
```bash
docker pull yigeronni/boxing_odds:boxing-odds
```

