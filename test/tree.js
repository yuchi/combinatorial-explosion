
import "should";

import { explodeTree } from "../lib";
import { log } from "./utils";

const node = (id, repeat, ...children) => ({ id, repeat, children });
const mock = (id, ...children) => ({ id, children });
const cfg = {
  fork(node) {
    if (!node) {
      return [];
    }

    let { repeat } = node;
    const results = [];

    while ((repeat--) > 0) {
      results.push({ ...node, id: `${node.id}-r${repeat}` });
    }

    return results;
  },

  extract(node) {
    return node ? node.children : [];
  },

  compose(node, children) {
    if (!node) {
      return null;
    }

    const { repeat, ...rest } = node;

    return { ...rest, children };
  }
};

describe("Tree explosion", () => {
  it("should work with null elements", () => {
    explodeTree(null, cfg).should.eql([]);
  });

  it("should work with a single element", () => {
    const tree = node('a', 1);

    explodeTree(tree, cfg).should.eql([
      mock('a-r0')
    ]);
  });

  it("should work with a single (repeated) element", () => {
    const tree = node('a', 3);

    explodeTree(tree, cfg).should.eql([
      mock('a-r2'),
      mock('a-r1'),
      mock('a-r0')
    ]);
  });

  it("should work with a simple tree", () => {
    const tree =
      node('a', 1,
        node('b', 1),
        node('c', 1));

    explodeTree(tree, cfg).should.eql([
      mock('a-r0',
        mock('b-r0'),
        mock('c-r0'))
    ]);
  });

  it("should work with a simple (repeated) tree", () => {
    const tree = node('a', 1,
      node('b', 3), node('c', 1));

    explodeTree(tree, cfg).should.eql([
      mock('a-r0',
        mock('b-r2'),
        mock('c-r0')),
      mock('a-r0',
        mock('b-r1'),
        mock('c-r0')),
      mock('a-r0',
        mock('b-r0'),
        mock('c-r0'))
    ]);
  });

  it("should work with a very deep repeated tree", () => {
    const tree =
      node('a', 1,
        node('b', 1,
          node('c', 1,
            node('d', 2))));

    explodeTree(tree, cfg).should.eql([
      mock('a-r0',
        mock('b-r0',
          mock('c-r0',
            mock('d-r1')))),
      mock('a-r0',
        mock('b-r0',
          mock('c-r0',
            mock('d-r0'))))
    ]);
  });

  it("should work with conditionals", () => {
    // We need a custom fork here
    const fork = function fork(node) {
      if (!node) {
        return [];
      }

      if (node.repeat) {
        return [ node, null ];
      }
      else {
        return [ node ];
      }
    };

    const tree =
      node('a', false,
        node('b', true),
        node('c', true));

    explodeTree(tree, { ...cfg, fork }).should.eql([
      // Both present
      mock('a',
        mock('b'),
        mock('c')),
      // Only 'b'
      mock('a',
        mock('b'),
        null),
      // Only 'c'
      mock('a',
        null,
        mock('c')),
      // None
      mock('a',
        null,
        null)
    ]);
  });
});
