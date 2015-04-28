/* 
 * http://mir.aculo.us/2011/03/09/little-helpers-a-tweet-sized-javascript-templating-engine/ 
 * 
 * usage:
 * 
 * $.t("Hello {who}! It's {time} ms since epoch.", { who: "JavaScript", time: Date.now });
 * // "Hello JavaScript! It's 1299680443046 ms since epoch."
 * 
 * */
(function($) {
    "use strict";
    $.t = function(s, d) {
        for (var p in d) {
            s = s.replace(new RegExp('{' + p + '}', 'g'), d[p]);
        }
        return s;
    };
})(jQuery);