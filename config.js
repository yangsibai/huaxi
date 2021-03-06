'use strict';
$(document).ready(function () {
    var $doctors = $('#doctors');
    var $min = $('#min');
    var $max = $('#max');
    var $btn = $('#save');
    var $logs = $('#logs');
    var $btnClear = $('#clear');

    function loadData() {
        var doctors = store.doctors;
        if (doctors && doctors.length > 0) {
            var d = doctors.map(function (item) {
                return item.name + ',' + item.url;
            });
            $doctors.val(d.join('\n'));
        }
        $min.val(store.min);
        $max.val(store.max);
    }

    loadData();

    $btn.click(function () {
        var doctors = $doctors.val().trim();
        var min = $min.val();
        var max = $max.val();
        if (doctors) {
            var arr = doctors.split('\n');
            if (arr.length > 0) {
                var docs = arr.map(function (item) {
                    var a = item.split(',');
                    return {
                        name: a[0],
                        url: a[1]
                    }
                });
                store.doctors = docs;
            }
        }
        store.min = min;
        store.max = max;
        loadData();
    });

    $btnClear.click(function () {
        store.count = 0;
        store.clearLogs();
        tick();
    });

    var $count = $('#count');

    function tick() {
        $count.text(window.localStorage.count || 0);
        var logs = store.logs;
        $logs.empty();
        logs.forEach(function (log) {
            $logs.append($(`<li>${getReadableTime(log.time)} ${log.message}</li>`))
        });
        $logs.animate({
            scrollTop: $logs[0].scrollHeight
        }, 'slow');
    }

    function getReadableTime(dateStr) {
        var time = new Date(dateStr);
        return `${time.getFullYear()}-${getMonth(time)}-${addPrefixZero(time.getDate())} ${addPrefixZero(time.getHours())}:${addPrefixZero(time.getMinutes())}:${addPrefixZero(time.getSeconds())}`
    }

    function getMonth(date) {
        var mon = date.getMonth() + 1;
        return addPrefixZero(mon);
    }

    function addPrefixZero(val) {
        return val < 10 ? '0' + val : val;
    }

    tick();
    setInterval(function () {
        tick();
    }, 3000);
});
