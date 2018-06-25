import { expect } from 'chai';
import 'mocha';
import { TypeException } from "../lib/type-exception";

describe('simple error', () => {
    it('should return a nice message', () => {

        expect(returnNewTypeException()).instanceOf(TypeException);

        function returnNewTypeException(): number {
            try {
                let a = 1;
                let b = 0;
                let c = a/b;
                return c;
            }
            catch(err){
                throw new TypeException('There is an error on division', err);
            }
        }
        
    });
})