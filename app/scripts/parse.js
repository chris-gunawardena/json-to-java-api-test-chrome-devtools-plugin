$scope = {};

function onErr(err, code) {
    if (!err) {
        $scope.error = 'Could not load or parse that.'
    } else {
        $scope.error = err;
    }
}

$scope.go = function () {
    if (/https?:\/\//.test($scope.toconvert)) {
        $http.get($scope.toconvert).success(function (res) {
            if (typeof res !== 'object') {
                res = JSON.parse(res);
            }
            $scope.toconvert = finish(res);
        }).error(onErr);
    } else {
        $scope.toconvert = finish($scope.toconvert);
    }
};

function finish(raw) {
    $scope.typename = $('#class-name').val();
    var result;
    if (typeof raw !== 'object') {
        try {
            result = JSON.parse(raw);
        } catch (err) {
            try {
                result = eval(raw);
            } catch (err2) {
                onErr(err);
            }
        }
    } else {
        if (Array.isArray(raw)) {
            result = deriveTypeFromArray(raw);
        } else {
            result = raw;
        }
    }
    if (Array.isArray(result)) {
        result = deriveTypeFromArray(result);
    }
    var res = toJava($scope.typename, result, -1);
    $scope.changed = false;
    $scope.error = null;
    return res;
}

function fill(depth) {
    var result = [];
    for (var i = 0; i < depth; i++) {
        result.push(' ');
    }
    return result.join('');
}

function deriveTypeFromArray(arr, intermittent) {
    var type = {};
    intermittent = intermittent || {};
    for (var i = 0; i < arr.length; i++) {
        var o = arr[i];
        for (var key in o) {
            if (o[key] !== null) {
                type[key] = o[key];
            }
        }
    }
    for (var i = 0; i < arr.length; i++) {
        var o = arr[i];
        for (var key in type) {
            if (typeof o[key] === 'undefined') {
                intermittent[key] = true;
            }
        }
    }
    return type;
}

function toJava(name, obj, depth, inter) {
    inter = inter || {};
    if (Array.isArray(obj)) {
        return '';
    }
    var out = [];
    var filler = fill(4);

    function prt(what, indent) {
        indent = depth + (indent || 0);
        var line = '';
        if (indent) {
            for (var i = 0; i < indent; i++) {
                line += filler;
            }
        }
        line += what;
        out.push(line);
    }

    function toTypeName(string, isArray) {
        var val = string.charAt(0).toUpperCase() + string.slice(1);
        var result = '';
        for (var i = 0; i < val.length; i++) {
            if (string.charAt(i) !== ' ' && string.charAt(i) !== '@') {
                result += val.charAt(i);
            }
        }
        if (/^\d+$/.test(result)) {
            result = "X" + result;
        }
        if (isArray && /.*ies$/.test(result) && result.length > 4) {
            result = result.substring(0, result.length - 3) + 'y';
        } else if (isArray && /.*s$/.test(result) && result.length > 3) {
            result = result.substring(0, result.length - 1);
        }
        return result;
    }

    function varname(string) {
        var val = string.charAt(0).toLowerCase() + string.slice(1);
        var result = '';
        for (var i = 0; i < val.length; i++) {
            if (string.charAt(i) !== ' ' && string.charAt(i) !== '@') {
                result += val.charAt(i);
            }
        }
        if (/^\d+$/.test(result)) {
            result = "x" + result;
        }
        return result;
    }

    function typeName(obj, optional) {
        var result = '';
        if (typeof obj === 'number') {
            if (obj % 1 !== 0) {
                result += optional ? 'Double' : 'double';
            } else {
                result += optional ? 'Long': 'long';
            }
        } else if (typeof obj === 'boolean') {
            result += optional ? 'Boolean' : 'boolean';
        } else if (typeof obj === 'string') {
            result += 'String';
        }
        if (/^\d+$/.test(result)) {
            result = "X" + result;
        }
        return result;
    }

    function declaration(obj, optional) {
        var result = "public final " + typeName(obj, optional) + ' ';
        return result;
    }

    function javaTypeOfArray(arr) {
        var result;
        for (var i = 0; i < arr.length; i++) {
            var o = arr[i];
            if (typeof o === 'object') {
                return;
            }
            if (typeof o === 'string') {
                if (result && (result !== 'string' && result !== 'String')) {
                    return 'Object';
                }
                result = 'String';
            }
            if (typeof o === 'number') {
                if (result && result !== 'number') {
                    return 'Object';
                }
                result = 'number';
            }
            if (typeof o === 'boolean') {
                if (result && result !== 'boolean') {
                    return 'Object';
                }
                result = 'boolean';
            }
        }
        if (result === 'number') {
            var decimal = false;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] % 1 > 0) {
                    decimal = true;
                    break;
                }
            }
            if (decimal) {
                result = 'double';
            } else {
                result = 'int';
            }
        }
        return result;
    }

    var objTypes = [];
    prt('public ' + (depth === -1 ? "" : "static ") + 'final class ' + toTypeName(name) + " {", 1);
    var constructorArgs = [];
    for (var key in obj) {
        if (/^\d+$/.test(key)) {
            continue;
        }
        if (typeof obj[key] === 'object') {
            var arr = Array.isArray(obj[key]);
            if (arr) {
                var jtype = javaTypeOfArray(obj[key]);
                if (jtype) {
                    constructorArgs.push(($scope.jackson ? '@JsonProperty(' + (inter[key] ? 'value=' : '') + '"' + varname(key) + '"' + (inter[key] ? ', required=false' : '') + ') ' : '') + jtype + '[] ' + varname(key));
                    prt('public final ' + jtype + '[]' + ' ' + varname(key) + ';', 2);
                    continue;
                }
                var inter = {};
                var tp = deriveTypeFromArray(obj[key], inter);
                objTypes.push([toTypeName(key, true), tp, inter]);
                constructorArgs.push(($scope.jackson ? '@JsonProperty(' + (inter[key] ? 'value=' : '') + '"' + varname(key) + '"' + (inter[key] ? ', required=false' : '') + ') ' : '') + toTypeName(key, true) + (arr ? '[]' : '') + ' ' + varname(key));
                prt('public final ' + toTypeName(key, true) + ' ' + varname(key) + (arr ? '[]' : '') + ';', 2);
            } else {
                objTypes.push([key, obj[key], {}]);
                constructorArgs.push(($scope.jackson ? '@JsonProperty(' + (inter[key] ? 'value=' : '') + '"' + varname(key) + '"' + (inter[key] ? ', required=false' : '') + ') ' : '') + toTypeName(key) + (arr ? '[]' : '') + ' ' + varname(key));
                prt('public final ' + toTypeName(key) + ' ' + varname(key) + (arr ? '[]' : '') + ';', 2);
            }
        } else {
            prt(declaration(obj[key], inter[key]) + varname(key) + ';', 2)
            constructorArgs.push(($scope.jackson ? '@JsonProperty(' + (inter[key] ? 'value=' : '') + '"' + varname(key) + '"' + (inter[key] ? ', required=false' : '') + ') ' : '') + typeName(obj[key], inter[key]) + ' ' + varname(key));
        }
    }
    prt('');
    if ($scope.jackson) {
        prt('@JsonCreator', 2);
    }
    prt('public ' + name + '(' + constructorArgs.join(', ') + '){', 2);
    for (var key in obj) {
        prt('this.' + varname(key) + " = " + varname(key) + ";", 3);
    }
    prt('}', 2);
    for (var i = 0; i < objTypes.length; i++) {
        var item = objTypes[i];
        var key = item[0];
        var val = item[1];
        var itr = item[2];
        prt('\n' + toJava(toTypeName(key), val, depth + 1, itr), 0);
    }
    prt('}', 1);
    return out.join('\n');
}