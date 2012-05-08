(function () {
    'use strict';
    
    var emem = {}, _emem = {};
    
    _emem.extend = function (obj1, obj2) {
        var key;        
        for (key in obj2) obj1[key] = obj2[key]; 
        return obj1;                        
    };        
    
    _emem.lookup = function (args) {
        var libKey, i = 0, length = 0, returnVal = [], stack = [], libs = _emem.conf.libs;
        
        for (libKey in libs) {
            if (libs[libKey]) {
                length = libs[libKey].versions.length;
                for (i; i<length; i++)                    
                    returnVal = stack.concat(returnVal, _emem.references({lib : libKey, version: libs[libKey].versions[i], operation: args.operation}));                                           

                i = 0;                    
            }                    
        }        
        
        return args.returnVal ? returnVal : true;
    };
                     
    _emem.references = function (args) {
        var refs;
        
        switch (args.lib) {
            case 'jQuery':
                refs = _emem.libRefLookup[args.lib](args.version, args.operation);
                break;            
        }
        
        return refs;
    };
    
    _emem.libRefLookup = {};    
    _emem.libRefLookup.jQuery = function (version, operation) {
        var jq = window[version], data, type, cache = jq.cache, refs = [], version = jq().jquery,
            item;        
            
        var legacy = function (obj, jq) {
            var key;
            
            for (key in obj) {
                if (obj[key].handle)
                    return obj[key];
            }
        }; 
        
        var validEl = function (el) {
            return (el !== window.document && el !== window) // either does not have a parentNode or cannot be removed           
        };            
                                           
        for (data in cache) {
            item = cache[data].handle ? cache[data] : legacy(cache[data], jq);                        
            
            if (item && !item.handle.elem.parentNode && validEl(item.handle.elem)) {                     
                for (type in item.events) {
                    switch (operation) {
                        case 'get':
                            refs.push({ lib: 'jQuery', version: version, type: type, el: item.handle.elem });
                            break;
                        case 'release':
                            jq.event.remove(item.handle.elem, type);
                            break;                            
                    }
                }                                                 
            }             
        }
        
        return refs;                 
    };
        
    _emem.conf = { libs : {} }
    
    _emem.setLibs = function (libs) { // TODO: validate libs                        
        _emem.extend(_emem.conf.libs, libs);
    };    
    
    // public    
    emem.conf = function (args) {
        _emem.setLibs(args.libs);
    };
    
    emem.addLib = function (lib) {
        _emem.setLibs(lib);
    };
    
    emem.garbage = function (args) {
        return _emem.lookup(_emem.extend({returnVal: true, operation: 'get'}, (args ? args : {})));        
    };
    
    emem.release = function (args) {
        return _emem.lookup(_emem.extend({returnVal: true, operation: 'release'}, (args ? args : {})));
    };   
    
    if (typeof define === 'function')
        define(emem);
    else
        window.emem = window.emem || emem;         
})();