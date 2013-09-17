var tasks = require('./tasks');
exports.test = function() {
    return "document" in global && "onreadystatechange" in global.document.createElement("script");
};

exports.install = function() {
    return function() {
        var handle = tasks.addFromSetImmediateArguments(arguments);

        // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
        // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
        var scriptEl = global.document.createElement("script");
        scriptEl.onreadystatechange = function() {
            tasks.runIfPresent(handle);

            scriptEl.onreadystatechange = null;
            scriptEl.parentNode.removeChild(scriptEl);
            scriptEl = null;
        };
        global.document.documentElement.appendChild(scriptEl);

        return handle;
    };
};
exports.clearImmediate = tasks.remove;