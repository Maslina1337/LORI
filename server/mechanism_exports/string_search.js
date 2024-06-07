"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function string_search(value, array) {
    // const search_accept_layers: {[key: string]: Array<string>} = {
    //     // Слои расположены в порядке от самого подходящего до не очень...
    //     has_this_value_at_begin_native_letter_case: [],
    //     has_this_value_at_begin_any_letter_case: [],
    //     has_this_value_somewhere_native_letter_case: [],
    //     has_this_value_somewhere_any_letter_case: [],
    // }
    // array.forEach((element, index) => {
    //     const native_case = element.indexOf(value);
    //     if (native_case !== -1) {
    //         if (native_case === 0) {
    //         }
    //     }
    // })
    let search_results = [];
    value = value.toLocaleLowerCase();
    array.forEach((string, index) => {
        string = string.toLocaleLowerCase();
        if (string.includes(value)) {
            search_results.push(string);
        }
    });
    array.sort();
}
exports.default = string_search;
