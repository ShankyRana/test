/* eslint-disable */
export function BaseExtender(bases: any): any {
  class Bases {
    constructor() {
      bases.forEach((base: any) => Object.assign(this, new base()));
    }
  }
  bases.forEach((base: any) => {
    Object.getOwnPropertyNames(base.prototype)
      .filter(prop => prop !== 'constructor')
      .forEach(prop => Bases.prototype[prop] = base.prototype[prop]);
  });
  return Bases;
}
/* eslint-enable */
