# Spotify Wrapped +

This is a web app that allows you to visualize your Spotify listening history, statistics, and habits. It is similar to Spotify's "Wrapped" feature, except you can use this any time.

This is unfortunately not hosted anywhere at the moment because Spotify only lets explictly added users to access third-party apps. Read more about it [here](https://developer.spotify.com/community/news/2021/05/27/improving-the-developer-and-user-experience-for-third-party-apps/).

## Local Installation & Set Up

1. Register a Spotify App in your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) and add `http://localhost:8888/callback` as a Redirect URI in the app settings

2. Create a `.env` file at the root of the project based on `.env.example` and add your unique `CLIENT_ID` and `CLIENT_SECRET` from the Spotify dashboard

3. Ensure you have [nvm](https://github.com/nvm-sh/nvm) and [npm](https://www.npmjs.com/) installed globally

4. Install the correct version of Node:

    ```shell
    nvm install
    ```

5. Install dependencies:

    ```shell
    npm install
    ```

6. Run the app:

    ```shell
    npm start
    ```
    You can access the front-end on http://localhost/3000, and the server is hosted on http://localhost:8888.
