# 事件发布/订阅模式
```
const EventEmitter = require('zhf.event-emitter');

const event = new EventEmitter();

const dogData = {name: 'dog'};
const catData = {name: 'cat'};
const pigData = {name: 'pig'};
const result = [];

// cat的第1次订阅
event.on('cat', (data) => {
    result.push(['cat的第1次订阅', data.nowData]);
});

// dog的第1次订阅
event.on('dog', (data) => {
    result.push(['dog的第1次订阅', data.nowData]);
});

// dog的第2次订阅
event.on('dog', (data) => {
    result.push(['dog的第2次订阅', data.nowData]);
});

// dog的第3次订阅
event.on('dog', (data) => {
    result.push(['dog的第3次订阅', data.nowData]);
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

// dog的发布
event.emit('dog', dogData);

// 取消dog和cat以及pig的全部订阅
event.off();

// dog的发布
event.emit('dog', dogData);

// cat的发布
event.emit('cat', catData);

// pig的单次订阅1
event.once('pig', (data) => {
    result.push(['pig的单次订阅1', data.nowData]);
});

// pig的单次订阅2
event.once('pig', (data) => {
    result.push(['pig的单次订阅2', data.nowData]);
});

// pig的单次订阅3
event.once('pig', (data) => {
    result.push(['pig的单次订阅3', data.nowData]);
});

// 取消pig的第2次单次订阅
event.off('pig', 2);

// pig的发布
event.emit('pig', pigData);

// pig的发布
event.emit('pig', pigData);

// minNum的订阅
event.once('minNum', (data) => {
    result.push(['minNum的测试', data.nowData]);
    console.log(event.arrToJson(data.allData)); // {minNumName1: {name: 'minNumName1'}, minNumName2: {name: 'minNumName2'}}
}, 2); // 至少要发布(emit)两次,订阅者(on)才会收到消息

// minNum的第1次发布 - 订阅者(on)收不到消息
event.emit('minNum', {name: 'minNumName1'}, (data) => {
    console.log(data); // {isDel: false, minNum: 2, triggerNum: 1, fn: [Function], data: {name: 'minNumName1'}}
});

// minNum的第2次发布 - 订阅者(on)能收到消息
event.emit('minNum', {name: 'minNumName2'}, (data) => {
    console.log(data); // {isDel: true, minNum: 2, triggerNum: 2, fn: [Function], data: {name: 'minNumName2'}}
});

// minNum的第3次发布 - 订阅者(on)收不到消息,因为订阅者收到消息后就取消了订阅,这是once方法的特性
event.emit('minNum', {name: 'minNumName3'}, (data) => {
    console.log(data); // 不会执行
});

// result
/*
[
    ['dog的第1次订阅', {name: 'dog'}],
    ['dog的第2次订阅', {name: 'dog'}],
    ['dog的第3次订阅', {name: 'dog'}],
    ['cat的第1次订阅', {name: 'cat'}],
    ['dog的第1次订阅', {name: 'dog'}],
    ['dog的第3次订阅', {name: 'dog'}],
    ['pig的单次订阅1', {name: 'pig'}],
    ['pig的单次订阅3', {name: 'pig'}],
    ['minNum的测试', {name: 'minNumName2'}],
]
*/
```
