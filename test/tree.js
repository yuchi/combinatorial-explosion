
import "should";

import { explodeTree } from "../src";
import { log } from "./utils";

const node = (id, repeat, ...children) => ({ id, repeat, children });
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
      { id: 'a-r0', children: [] }
    ]);
  });

  it("should work with a single (repeated) element", () => {
    const tree = node('a', 3);

    explodeTree(tree, cfg).should.eql([
      { id: 'a-r2', children: [] },
      { id: 'a-r1', children: [] },
      { id: 'a-r0', children: [] }
    ]);
  });

  it("should work with a simple tree", () => {
    const tree = node('a', 1,
      node('b', 1), node('c', 1));

    explodeTree(tree, cfg).should.eql([
      { id: 'a-r0', children: [
        { id: 'b-r0', children: [] },
        { id: 'c-r0', children: [] }
      ] }
    ]);
  });

  it("should work with a simple (repeated) tree", () => {
    const tree = node('a', 1,
      node('b', 3), node('c', 1));

    explodeTree(tree, cfg).should.eql([
      { id: 'a-r0', children: [
        { id: 'b-r2', children: [] },
        { id: 'c-r0', children: [] }
      ] },
      { id: 'a-r0', children: [
        { id: 'b-r1', children: [] },
        { id: 'c-r0', children: [] }
      ] },
      { id: 'a-r0', children: [
        { id: 'b-r0', children: [] },
        { id: 'c-r0', children: [] }
      ] }
    ]);
  });

  it("should work with a very deep repeated tree", () => {
    const tree =
      node('a', 1,
        node('b', 1,
          node('c', 1,
            node('d', 2))));

    explodeTree(tree, cfg).should.eql([
      { id: 'a-r0', children: [
        { id: 'b-r0', children: [
          { id: 'c-r0', children: [
            { id: 'd-r1', children: [] }
          ] }
        ] }
      ] },
      { id: 'a-r0', children: [
        { id: 'b-r0', children: [
          { id: 'c-r0', children: [
            { id: 'd-r0', children: [] }
          ] }
        ] }
      ] }
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
      { id: 'a', children: [
        { id: 'b', children: [] },
        { id: 'c', children: [] }
      ] },
      // Only 'b'
      { id: 'a', children: [
        { id: 'b', children: [] },
        null
      ] },
      // Only 'c'
      { id: 'a', children: [
        null,
        { id: 'c', children: [] }
      ] },
      // None
      { id: 'a', children: [
        null, null
      ] }
    ]);
  });
});
