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

    public toString(): string {
        return this.toStringWithData(this, 0);
    }

    public toStringWithData(value: Error, tabIndex: number = 0): string {
        let output = '';
        let tabs = "    ".repeat(tabIndex);
        
        //Se anexa el mensaje
        if (tabIndex > 0)
            output = output + tabs + "InnerException: " + value.message + "\n";
        else
            output = output + tabs + "Error: " + value.message + "\n";

        //Se anexa el stacktrace
        if (value.stack && value.stack.replace(/\s/g, "").length>0)
            output = output + "StackTrace:\n" + value.stack.split('\n').slice(1).map(x => tabs + x).join('\n');

        
        if(value instanceof TypeException) {
            //Se anexa el data
            if (value.data()) {
                let jsonStringify = JSON.stringify(value.data(), null, "\t");
                let dataLines = jsonStringify.split("\n");
                let dataLinesLen = dataLines.length - 1;
                jsonStringify = dataLines
                    .map((x, i) => {
                        if(i == 0 || i == dataLinesLen)
                            return tabs + x.replace(/\t/g,"");
                        else
                            return tabs + "    " + x.replace(/\t/g,"");
                    })
                    .join("\n");
                let data = "\n" + tabs + "Data: " + jsonStringify;
                output = output + data;
            }

            //Se muestran los errores hijos
            if (value.aggregateErrors && value.aggregateErrors.length > 0) {
                (<Error[]><any>value.aggregateErrors).forEach(err => {
                    if(err instanceof TypeException)
                        output = output + "\n" + (<TypeException>err).toStringWithData(err, tabIndex + 1);
                    else
                        output = output + "\n" + this.getStringFromBaseError(err, tabIndex + 1);
                });
            } 
            
            if (value.innerError != null) {
                if(value._innerError && value._innerError instanceof TypeException) {
                    var typedInnerError: TypeException = <TypeException><any>value.innerError;
                    output = output + "\n" + typedInnerError.toStringWithData(typedInnerError, tabIndex + 1);
                }
                else if(value._innerError) {
                    output = output + "\n" + this.getStringFromBaseError(value._innerError, tabIndex + 1);
                }
            }
        }
        
        return output;
    }

    private getStringFromBaseError(err: Error, tabIndex: number = 0): string {
        let tabs = "    ".repeat(tabIndex);
        let output = tabs + "Inner Error: " + err.message;
        
        if(err.stack) {
            output = output + "\n" + tabs + "StackTrace:\n" + err.stack.split("\n")
                .map(x => tabs + x)
                .slice(1)
                .join("\n");
        }

        return output;
    }
}