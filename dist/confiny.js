(function(){function n(e,t){for(var r in t)e||(e={}),"object"==typeof t[r]?e[r]=n(e[r],t[r]):e[r]=t[r];return e}function r(e,t){var n=t.split(".");while(n.length&&(e=e[n.shift()]));return e}var e={},t={},i={getModule:function(r,i){if(i===undefined)throw"Given callback is undefined";e[r]===undefined?(console.log("Application does not have any module named "+r+", yet"),t[r]===undefined&&(t[r]=[]),t[r].push(i)):i(e[r])},setModule:function(i,s){if(s===undefined)throw"Given config is undefined";var o=!1;return e[i]===undefined&&(e[i]={},o=!0),e[i]=n(e[i],s),o&&t[i]!=undefined&&(t[i].every(function(t,n,r){t(e[i])}),t[i]=[]),!0},key:function s(t,s,n){return n===undefined?e[t][s]:(e[t]===undefined&&(e[t]={}),e[t][s]=n,!0)},conf:function(i,s,o){if(e[i]===undefined)throw"Application does not have any module named "+i;if(typeof o!="object")throw"Target is not an object";var u=r(e[i],s);if(typeof u!="object")throw"Key value is not an object";n(o,u)}};typeof define=="function"&&define.amd?define("confiny",[],function(){return i}):typeof module!="undefined"&&module.exports?module.exports=i:this.modion=i}).call(this);