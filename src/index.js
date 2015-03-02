
export const explode = (list = []) =>
  // We fold the forks from left to right
  list.reduce((results, forks) =>
    // Empty forks are no-op…
    (!forks || !forks.length) ?
      // …and give back the initial result
      results :
      // We explode every result built so far…
      results.reduce((memo, result) => [
          // …in a single array…
          ...memo,
          // …by ‘multiplying it’ with every fork we encounter
          ...forks.map(fork =>
            // concat’ing the result with every new possible piece
            [ ...result, fork ])
        ], []), [[]]);

export const explodeTree = (tree, { fork, extract, compose }) =>
  // Fork this tree node into its combinatories
  fork(tree)
    // Then transform every possible path into…
    .reduce((memo, node) => [
      // …a single array…
      ...memo,
      // …which is the product between itself and children’s combinatories.
      ...explode(
        // So we get the children...
        extract(node)
          // …and treat each as a tree…
          .map(child =>
            // exploding it (fork = Node => [ Node ])
            explodeTree(child, { fork, extract, compose }))
      )
      // …and recompose the result as a node with children,
      .map(children =>
        // and it should return a **new node** every time
        compose(node, children))
    ], []);
