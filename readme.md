# 事件发布/订阅模式
```
const event = require('zhf.event');

const dogData = {name: 'dog'};
const catData = {name: 'cat'};
const pigData = {name: 'pig'};
const result = [];

// cat的第1次订阅
event.on('cat', (data) => {
    result.push(['cat的第1次订阅', data]);
});

// dog的第1次订阅
event.on('dog', (data) => {
    result.push(['dog的第1次订阅', data]);
});

// dog的第2次订阅
event.on('dog', (data) => {
    result.push(['dog的第2次订阅', data]);
});

// dog的第3次订阅
event.on('dog', (data) => {
    result.push(['dog的第3次订阅', data]);
});

// dog的发布
event.emit('dog', dogData);

// cat的发布
event.emit('cat', catData);

// 取消dog的第2次订阅
event.off('dog', 2);

// dog的发布
event.emit('dog', dogData);

// 取消dog的全部订阅
event.off('dog');

// 取消dog和cat以及pig的全部订阅
event.off();

// dog的发布
event.emit('dog', dogData);

// cat的发布
event.emit('cat', catData);

// pig的单次订阅
event.one('pig', (data) => {
    result.push(['pig的单次订阅', data]);
});

// pig的发布
event.emit('pig', pigData);

// pig的发布
event.emit('pig', pigData);

// result
/*
[
    ['dog的第1次订阅', {name: 'dog'}],
    ['dog的第2次订阅', {name: 'dog'}],
    ['dog的第3次订阅', {name: 'dog'}],
    ['cat的第1次订阅', {name: 'cat'}],
    ['dog的第1次订阅', {name: 'dog'}],
    ['dog的第3次订阅', {name: 'dog'}],
    ['pig的单次订阅', {name: 'pig'}],
]
*/
```
