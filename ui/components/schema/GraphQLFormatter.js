const formatGraphQLField = field => {
    function renderType(type) {
        let result = "";
        switch (type.kind) {
            case "LIST":
                result += "[";
                result += renderType(type.ofType);
                result += "]";
                break;
            case "NON_NULL":
                result += renderType(type.ofType);
                result += "!";
                break;
            default:
                result += type.name;
                break;
        }

        return result;
    }

    const {name, type} = field;
    let result = name;
    result += "(";
    result += "): ";
    result += renderType(type);
    return result;

};

export {formatGraphQLField}