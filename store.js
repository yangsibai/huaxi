'use strict';
var LS = window.localStorage;
var store = {
    get count() {
        return LS.count || 0;
    },
    set count(v) {
        LS.count = v;
    },
    get doctors() {
        if (LS.doctors) {
            return JSON.parse(LS.doctors);
        }
        return [
            {
                name: '段荫乔',
                url: 'http://www.cd120.com/doctorByCode.jspx?doctorCode=0086&clinnicId=246'
            },
            {
                name: '贺建清',
                url: 'http://www.cd120.com/doctorByCode.jspx?doctorCode=11021&clinnicId=246'
            }
        ];
    },
    set doctors(arr) {
        if (arr && arr.length > 0) {
            LS.doctors = JSON.stringify(arr);
        }
    },
    get min() {
        return LS.min || 30;
    },
    set min(v) {
        if (v < 10) {
            v = 10;
        }
        LS.min = v;
    },
    get max() {
        return LS.max || 600;
    },
    set max(v) {
        LS.max = v;
    },
    get logs() {
        return LS.logs && JSON.parse(LS.logs) || [];
    },
    log: function (msg) {
        var logs = this.logs;
        msg.time = new Date();
        logs.unshift(msg);
        LS.logs = JSON.stringify(logs);
    }
};

window.store = store;
