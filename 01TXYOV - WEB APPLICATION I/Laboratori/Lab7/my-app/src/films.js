/* 
 * [2022/2023]
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Lab 7
 */

import dayjs from 'dayjs';
import { Film } from './FilmModel';
/* 
 * This data structure emulates a database of movies.
 * In the future these data will be retrieved from the server in the future
 */
const FILMS = new Array(
    new Film(1, "Pulp Fiction", true, dayjs("2023-03-10"), 5 ),
    new Film(2, "21 Grams", true, dayjs("2023-03-17"), 5 ),
    new Film(3, "Star Wars", false ),
    new Film(4, "Matrix", true ),
    new Film(5, "Shrek", false, dayjs("2023-04-13"), 3 )
);

export default FILMS;
