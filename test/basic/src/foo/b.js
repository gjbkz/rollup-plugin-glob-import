global.bb = 'bb';
export default 'b0';
export const b1 = 'b1';
export function b2() {}
export {b1 as b3, b2 as b4};
export class B5 {
    static get name() {
        return 'B5';
    }
}
