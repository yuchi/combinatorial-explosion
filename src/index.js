
const explode = (list = []) => list.reduce((results, forks) =>
  (!forks || !forks.length) ?
    results :
    results.reduce((memo, result) =>
      [ ...memo, ...forks.map(fork =>
        [ ...result, fork ]) ], []), [[]]);

export default explode;

export { explode };
