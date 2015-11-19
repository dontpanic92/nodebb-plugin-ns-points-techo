function define(name, value) {
    Object.defineProperty(exports, name, {
        value     : value,
        enumerable: true
    });
}

define('NAMESPACE', 'ns:points');
define('SIGNIN_NAMESPACE', 'ns:points:signin:');
define('SOCKETS', 'ns-points');
