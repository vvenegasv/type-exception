import { should } from 'chai';
import { TypeException, nameof } from "../lib/index";
should();

describe('simple error', () => {
    it('check error type', () => {
        let err = returnNewTypeException();
        err.should.instanceOf(TypeException);

        function returnNewTypeException(): Error {
            try {
                throw new Error('Ups, something was wrong');
            }
            catch(err){
                return new TypeException('There is an error =(', err);
            }
        }
    });

    it('check message error', () => {
        let err = returnNewTypeException();
        let message = err.toString();
        //console.log(message);
        message.should.contains("Error: There is an error on toExponential");
        message.should.contains("Inner Error: Cannot read property 'toExponential' of undefined");
        

        function returnNewTypeException(): Error {
            try {
                let items: number[] = [1,2];
                let val = items[6];
                let newVal = val.toExponential(4);
                return new Error('Error was not raised');
            }
            catch(err){
                let newErr = new TypeException('There is an error on toExponential', err);
                let text1 = "some message";
                let num1 = 4;
                let date1 = Date.now;
                newErr.tryAddData(nameof(() => text1), text1);
                newErr.tryAddData(nameof(() => num1), num1);
                newErr.tryAddData(nameof(() => date1), date1);
                return newErr;
            }
        }
    });
    
})