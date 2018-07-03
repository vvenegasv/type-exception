 /*
 credits for Titian Cernicova-Dragomir on StackOverflow
 https://stackoverflow.com/questions/29191451/get-name-of-variable-in-typescript
 */
export function nameof<TResult>(getVar: () => TResult) {
    var m = getVar.toString().split("=>").map(x => x.trim());

    if (m == null)
        throw new Error("The function does not contain a statement matching 'return variableName;'");

    var fullMemberName = m[1];
    var memberParts = fullMemberName.split('.');

    return memberParts[memberParts.length-1];
}