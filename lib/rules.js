var is = require('is');

// Compile a rule
// If rule has a "regex" property, it'll be used to setup the match method
// "toText" can also be defined as a template string
function compileRule(rule) {
    if (rule.regexp) {
        rule.match = function(str) {
            var block = {};

            var match = rule.regexp.exec(str);
            if (!match) return null;

            if (rule.props) block = rule.props(match);
            if (!block) return null;

            block.raw = is.undefined(block.raw)? match[0] : block.raw;
            block.text = is.undefined(block.text)? match[0] : block.text;
            block.type = block.type || rule.type;

            return block;
        };
    }

    if (is.string(rule.toText)) {
        var tpl = rule.toText;
        rule.toText = function(text) {
            return tpl.replace('%s', text);
        };
    }

    return rule;
}

module.exports = {
    compile: compileRule
};