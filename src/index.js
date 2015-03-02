
export const explode = (list = []) =>
  // We fold the forks from left to right
  list.reduce((results, forks) =>
    // Empty forks are no-op…
    (!forks || !forks.length) ?
      // …and give back the initial result
      results :
      // We explode every result built so far…
      results.reduce((memo, result) =>
        // …by ‘multiplying it’ with every fork we encounter
        [ ...memo, ...forks.map(fork =>
          // concat’ing the result with every new possible piece
          [ ...result, fork ]) ], []), [[]]);

export const explodeTree = (tree, cfg) =>
  // Fork this tree node into its combinatories
  cfg.fork(tree)
    // Then transform every possible path into a single array…
    .reduce((memo, node) =>
      // …which is the product between it and its combinatories
      [ ...memo, ...explodeTreeNode(node, cfg) ], []);

const explodeTreeNode = (node, cfg) => {
    const list =
      // Get the children...
      cfg.extract(node)
        // …and treat each as a tree…
        .map(child =>
          // exploding it (fork = Node => [ Node ])
          explodeTree(child, cfg));

    // Treat the result as a list of combinatories by exploding it…
    return explode(list)
      // …and recompose the result as a node with children,
      .map(children =>
        // and it should return a **new node** every time
        cfg.compose(node, children));
};
