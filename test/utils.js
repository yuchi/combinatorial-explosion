
import { inspect } from "util";

export const log = {
  [ Symbol.referenceGet ]( o ) {
    console.log(inspect(o, { depth: 999 }));
    return o;
  }
};
