"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Super = function () {
    function Super() {
        _classCallCheck(this, Super);

        this.event = {};
    }

    // 订阅


    _createClass(Super, [{
        key: "on",
        value: function on(str, fn) {
            var obj = this.event[str];
            if (!obj) {
                obj = [];
                this.event[str] = obj;
            }
            obj.push(fn);
        }

        // 发布

    }, {
        key: "emit",
        value: function emit(str, data) {
            var obj = this.event[str];
            if (obj) {
                obj.forEach(function (fn) {
                    fn(data);
                });
            }
        }
    }]);

    return Super;
}();

module.exports = new Super();