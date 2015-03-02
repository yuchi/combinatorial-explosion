combinatorial-explosion
=======================

> Boom.

[![Build Status](https://img.shields.io/travis/yuchi/combinatorial-explosion.svg?style=flat-square)](https://travis-ci.org/yuchi/combinatorial-explosion)
[![Dev Dependencies](https://david-dm.org/yuchi/combinatorial-explosion/dev-status.svg?style=flat-square)](https://david-dm.org/yuchi/combinatorial-explosion#info=devDependencies)
[![Available on NPM](https://img.shields.io/npm/v/combinatorial-explosion.svg?style=flat-square)](https://www.npmjs.org/package/combinatorial-explosion)

Install it with:

```prompt
npm install --save combinatorial-explosion
```

Usage
-----

Import it in your favourite way:

```js
// be it ES2015
import { explode, explodeTree } from 'combinatorial-explosion';
// or CommonJS
var combExpl = require('combinatorial-explosion');
var explode = combExpl.explode;
var explodeTree = combExpl.explodeTree;
```

then you can use it to blow up lists:

```js
console.dir(explode([
  [ 'a1', 'a2' ],
  [ 'b' ],
  [ 'c1', 'c2' ]
]));

// outputs:

[ [ 'a1', 'b', 'c1' ],
  [ 'a1', 'b', 'c2' ],
  [ 'a2', 'b', 'c1' ],
  [ 'a2', 'b', 'c2' ] ]
```

and trees (procedurally):

```js
const tree = {
  id: 'a',
  children: [
    { id: 'b', children: [] },
    { id: 'c', children: [] }
  ]
};

// Get a list of possible nodes out of a single one
// fork :: Node => [ Node ]
function fork(node) {
  if (node.id === 'c') {
    // as an example 'c' will be split in two
    return [ { ...node, id: 'c1' }, { ...node, id: 'c2' } ];
  }
  else {
    // everything else will return a single path
    return [ node ];
  }
}

// Extract the children
// extract :: Node => [ Node ]
function extract(node) {
  return node.children;
}

// Create a **new** node for the given base node and children
// compose :: (NodeAttrs, [ Node ]) => Node
function compose(node, children) {
  return { ...node, children };
}

console.dir(explodeTree(tree, { fork, extract, compose }));

// outputs:

// a list…
[
  // of trees…
  {
    id: 'a',
    children: [
      { id: 'b', children: [] },
      // with every ‘fork’ you made, here’s `c1`
      { id: 'c1', children: [] }
    ]
  },
  {
    id: 'a',
    children: [
      { id: 'b', children: [] },
      // and here’s `c2`!
      { id: 'c2', children: [] }
    ]
  }
]
```


License
-------

This library, *combinatorial-explosion*, is free software ("Licensed Software"); you can
redistribute it and/or modify it under the terms of the [GNU Lesser General
Public License](http://www.gnu.org/licenses/lgpl-2.1.html) as published by the
Free Software Foundation; either version 2.1 of the License, or (at your
option) any later version.

This library is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; including but not limited to, the implied warranty of MERCHANTABILITY,
NONINFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General
Public License for more details.

You should have received a copy of the [GNU Lesser General Public
License](http://www.gnu.org/licenses/lgpl-2.1.html) along with this library; if
not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth
Floor, Boston, MA 02110-1301 USA
