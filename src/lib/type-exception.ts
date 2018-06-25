export class TypeException extends Error {
    private _innerError?: Error;
    private _aggregateErrors?: Error[];
    private _data: { [id:string]: any } = {};

    constructor(message: string, innerError?: Error, aggregateErrors?: Error[]){
        super(message);
        this._innerError = innerError;
        this._aggregateErrors = aggregateErrors;
    }

    public innerError(): Error | null {
        return this._innerError || null;
    }

    public aggregateErrors(): Error[] | null {
        return this._aggregateErrors || null;
    }

    public data(): { [id:string]: any } {
        return this._data;
    }

    public tryAddData(key: string, value: any): boolean {
        try {
            if(!key)
                return false;
            
            if(key.replace(/\s/g, "").length < 1)
                return false;

            if(this._data[key])
                return false;
            
            this._data[key] = value;
            return true;
        } catch(err) {
            console.log("Ocurrió un error al agregar el item al diccionario de datos de errores " + err.toString());
            return false;
        }
    }

    public toStringWithData(value: Error, tabIndex: number = 0): string {
        let output = '';
        let tabs = "\t".repeat(tabIndex);
        
        //Se anexa el mensaje
        if (tabIndex > 0)
            output = output + tabs + "InnerException: " + value.message;
        else
            output = output + tabs + value.message;

        //Se anexa el stacktrace
        if (value.stack && value.stack.replace(/\s/g, "").length>0)
            output = output + value.stack.split('\n').map(x => tabs + x).join('');

        
        if(value instanceof TypeException) {
            //Se anexa el data
            if (value.data && value.data.length > 0) {
                let data = "'Data': " + JSON.stringify(value.data);
                data = data.split("\n").map(x => tabs + x).join("");
                output = output + data;
            }

            //Se muestran los errores hijos
            if (value.aggregateErrors && value.aggregateErrors.length > 0) {
                (<Error[]><any>value.aggregateErrors).forEach(err => {
                    if(err instanceof TypeException)
                        output = output + (<TypeException>err).toStringWithData(err, tabIndex + 1);
                    else
                        output = output.toString();
                });
            } 
            
            if (value.innerError != null) {
                if(value._innerError && value._innerError instanceof TypeException) {
                    var typedInnerError: TypeException = <TypeException><any>value.innerError;
                    output = output + typedInnerError.toStringWithData(typedInnerError, tabIndex + 1);
                }
            }
        }
        
        return output;
    }
}