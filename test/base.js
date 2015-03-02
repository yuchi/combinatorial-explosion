
import "should";

import { explode } from "../src";

const log = {
  [ Symbol.referenceGet ]( o ) {
    console.log(o);
    return o;
  }
};

describe("Array explosion", () => {

  it("should work with no path", () => {
    explode().should.eql([ [] ]);
    explode([ ]).should.eql([ [] ]);
    explode([ [] ]).should.eql([ [] ]);
    explode([ [], [] ]).should.eql([ [] ]);
  });

  it("should work with simple paths", () => {
    explode([ [ 0 ] ]).should.eql([ [ 0 ] ]);
    explode([ [ 0 ], [ 1 ] ]).should.eql([ [ 0, 1 ] ]);
  });

  it("should work with mixed empty paths", () => {
    explode([ [], [ 0 ] ]).should.eql([ [ 0 ] ]);
    explode([ [], [ 0 ], [] ]).should.eql([ [ 0 ] ]);
  });

  it("should work with two paths", () => {
    explode([ [ 0, 1 ] ]).should.eql([ [ 0 ], [ 1 ] ]);
    explode([ [ 0, 1 ], [ 2 ] ]).should.eql([ [ 0, 2 ], [ 1, 2 ] ]);
    explode([ [ 0 ], [ 1, 2 ] ]).should.eql([ [ 0, 1 ], [ 0, 2 ] ]);

    explode([ [ 0, 1 ], [ 2, 3 ] ]).should.eql([
      [ 0, 2 ], [ 0, 3 ], [ 1, 2 ], [ 1, 3 ]
    ]);
  });

  it("should work with some random data", () => {
    explode([
      [ 0, 1 ],
      [ 2 ],
      [ 3, 4, 5 ]
    ]).should.eql([
      [ 0, 2, 3 ],
      [ 0, 2, 4 ],
      [ 0, 2, 5 ],
      [ 1, 2, 3 ],
      [ 1, 2, 4 ],
      [ 1, 2, 5 ]
    ]);
  });

  it("should work with undefined/null values", () => {
    explode([ [ null ] ]).should.eql([ [ null ] ]);
    explode([ [ null, undefined ] ]).should.eql([ [ null ], [ undefined ] ]);
    explode([
      [ null ],
      [ null, undefined ]
    ]).should.eql([
      [ null, null ],
      [ null, undefined ]
    ]);
  });

  it("should make a big boom (read this test’s source to get it)", () => {
    const range = max => {
      let results = [];
      for (let i = 0; i < max; ++i) results[ i ] = i;
      return results;
    };

    explode(range(5).map(range)).should.eql([
      [ 0, 0, 0, 0 ],
      [ 0, 0, 0, 1 ],
      [ 0, 0, 0, 2 ],
      [ 0, 0, 0, 3 ],
      [ 0, 0, 1, 0 ],
      [ 0, 0, 1, 1 ],
      [ 0, 0, 1, 2 ],
      [ 0, 0, 1, 3 ],
      [ 0, 0, 2, 0 ],
      [ 0, 0, 2, 1 ],
      [ 0, 0, 2, 2 ],
      [ 0, 0, 2, 3 ],
      [ 0, 1, 0, 0 ],
      [ 0, 1, 0, 1 ],
      [ 0, 1, 0, 2 ],
      [ 0, 1, 0, 3 ],
      [ 0, 1, 1, 0 ],
      [ 0, 1, 1, 1 ],
      [ 0, 1, 1, 2 ],
      [ 0, 1, 1, 3 ],
      [ 0, 1, 2, 0 ],
      [ 0, 1, 2, 1 ],
      [ 0, 1, 2, 2 ],
      [ 0, 1, 2, 3 ]
    ]);

    explode(range(4).map(_ => [ '...', 'MMM' ]))
      .map(a => a.join('')).join('\n')
      .should.eql(`
............
.........MMM
......MMM...
......MMMMMM
...MMM......
...MMM...MMM
...MMMMMM...
...MMMMMMMMM
MMM.........
MMM......MMM
MMM...MMM...
MMM...MMMMMM
MMMMMM......
MMMMMM...MMM
MMMMMMMMM...
MMMMMMMMMMMM
`.trim())
  });

});
