[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/amamenko/hollywoodle#gh-dark-mode-only">
   <img src="./client/src/assets/LogoWhite.svg" width="400" />
  </a>
   <a href="https://github.com/amamenko/hollywoodle#gh-light-mode-only">
    <img src="./client/src/assets/LogoBlack.svg" width="400" />
  </a>
  <h3 align="center" height="50">Hollywoodle</h3>
  <p align="center">
    A MERN-stack Hollywood-themed
    <br />
    Wordle Spinoff Game
    <br />
    <br />
    <a href="https://www.hollywoodle.ml/">Visit Website</a>
    ·
    <a href="https://github.com/amamenko/hollywoodle/issues">Report Issue</a> 
  </p>
</p>

## Background

[Wordle](https://www.nytimes.com/games/wordle/index.html) is a massively popular web-based [word game](https://en.wikipedia.org/wiki/Wordle) initially created by Welsh software engineer [Josh Wardle](https://en.wikipedia.org/wiki/Josh_Wardle) and currently owned by the [New York Times Company](https://www.nytimes.com/2022/01/31/business/media/new-york-times-wordle.html). Since the game's incepetion, many clones and similar spin-off games have been created - perhaps the largest listing of all such games can be found at the [Wordleverse website](https://wordleverse.net/).

In March of 2022, it seemed that the Wordleverse had a dearth of movie-related Wordle spin-offs. With the [94th Academy Awards](https://en.wikipedia.org/wiki/94th_Academy_Awards) (popularly known as the Oscars) quickly approaching, the timing seemed perfect for a Hollywood-themed Wordle-like game to enter the Wordleverse.

Originally the brainchild of Alex Jaloza, Hollywoodle provides users two new daily actors to link either by movie or by co-star with the fewest possible guesses. The user is given points for each guess - 10 points for a correct guess, 30 points for an incorrect guess, and 20 points for a guess of a movie that only features the final actor and not the first or current one (partial credit). If a user needs a hint they are penalized 30 points.

In essence, the objective of the game is to score as few points as possible with the fewest guesses as possible.

## Functionality

Hollywoodle is built with the [MERN](https://www.geeksforgeeks.org/mern-stack/) stack and features a React-Typescript front-end with a Node/Express Typescript server linked to a [MongoDB Atlas Database](https://www.mongodb.com/cloud/atlas/lp/try2?utm_source=google&utm_campaign=gs_americas_united_states_search_core_brand_atlas_desktop&utm_term=mongodb%20atlas&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624338&adgroup=115749704063&gclid=CjwKCAjwuYWSBhByEiwAKd_n_lJ4kymFETif8K0fhDtRPrhaNIB_lQsxRKht4u1YhiX-tQDOXAwD2hoCS9kQAvD_BwE). The application can be broken down into two parts:

### Server-side

- Uses the [TMDB API](https://developers.themoviedb.org/3/people/get-popular-people) to update and store the details of two popular actors (including names, images, TMDB IDs, genders, and most popular recent movie data) in a MongoDB Atlas Database every night at midnight ET.
- Queries the MongoDB database to send that actor data to the front-end.

### Client-side

- Requests actor data from the backend and renders details about the initial and final actor for the user to guess the relation.
- Sets a [dark/light-mode](https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/) theme based on the user's native preferred specification (although this can also be manually toggled by the user).
- Uses React's [Context API](https://reactjs.org/docs/context.html) to store and access widely-used state variables such as points and dark-mode configuration throughout the application.
- [Autosuggests](https://github.com/moroshko/react-autosuggest) movies or actors (details of which are once again fetched from TMDB) based on a user's search input.
- Determines the correctness of a user's guess selection by means of movie cast ID lookup that searches for a match using TMDB's movie and actor IDs.
- Displays a popcorn emoji (🍿) [confetti rain effect](https://www.npmjs.com/package/react-rewards) when a user successfuly links the first given actor with the final given actor.


## Deployment

Client-side deployed with [Vercel](https://vercel.com/). Custom domain from [Freenom](https://www.freenom.com/en/index.html?lang=en) with DNS routing provided by [Cloudflare](https://www.cloudflare.com/).

Server deployed via [Heroku](https://www.heroku.com/). Free Heroku dyno kept awake with [UptimeRobot](https://uptimerobot.com/).

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- CONTACT -->

## Contact

Avraham (Avi) Mamenko - avimamenko@gmail.com

Project Link: [https://github.com/amamenko/hollywoodle](https://github.com/amamenko/hollywoodle)

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

- [The Movie Database (TMDB) API](https://developers.themoviedb.org/3)
- [Heroku](https://www.heroku.com/)
- [UptimeRobot](https://uptimerobot.com/)
- [node-cron](https://www.npmjs.com/package/node-cron)
- [react-rewards](https://www.npmjs.com/package/react-rewards)
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/amamenko/hollywoodle/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/avrahammamenko
