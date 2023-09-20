/* 
 * [2022/2023]
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Lab 5
 */

import dayjs from 'dayjs';

/* 
 * This data structure emulates a database of movies.
 * In the future these data will be retrieved from the server in the future
 */
const FILMS = [
    { id: 1, title: "Pulp Fiction", favorites: true, date: dayjs("2023-03-10"), rating: 5 },
    { id: 2, title: "21 Grams", favorites: true, date: dayjs("2023-03-17"), rating: 5 },
    { id: 3, title: "Star Wars", favorites: false },
    { id: 4, title: "Matrix", favorites: true },
    { id: 5, title: "Shrek", favorites: false, date: dayjs("2023-04-13"), rating: 3 }
];

export default FILMS;
