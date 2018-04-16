# 事件发布/订阅模式
* removeEventListener是根据函数名称来清除订阅的，索引从1开始。索引为0或者不传索引会取消全部指定函数名称的订阅（非匿名函数订阅会进行全部取消）。
* off是根据索引来清除订阅的，索引从1开始。索引为0或者不传索引会取消全部订阅（匿名或者非匿名函数订阅会进行全部取消）。
    - off也具备removeEventListener的功能，传参顺序更改一下即可。
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
    // console.log(event.arrToJson(data.allData)); // {minNumName1: {name: 'minNumName1'}, minNumName2: {name: 'minNumName2'}}
}, 2); // 至少要发布(emit)两次,订阅者(on)才会收到消息

// minNum的第1次发布 - 订阅者(on)收不到消息
event.emit('minNum', {name: 'minNumName1'}, (data) => {
    // console.log(data); // {isDel: false, minNum: 2, triggerNum: 1, fn: [Function], data: {name: 'minNumName1'}}
});

// minNum的第2次发布 - 订阅者(on)能收到消息
event.emit('minNum', {name: 'minNumName2'}, (data) => {
    // console.log(data); // {isDel: true, minNum: 2, triggerNum: 2, fn: [Function], data: {name: 'minNumName2'}}
});

// minNum的第3次发布 - 订阅者(on)收不到消息,因为订阅者收到消息后就取消了订阅,这是once方法的特性
event.emit('minNum', {name: 'minNumName3'}, (data) => {
    // console.log(data); // 不会执行
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

```
const EventEmitter = require('zhf.event-emitter');

const event = new EventEmitter();
const result = [];

function test1(data) {
    // console.log('订阅发布测试2-addEventListener订阅-test1\n', data);
}

function test2(data) {
    // console.log('订阅发布测试2-addEventListener订阅-test2\n', data);
}

event.on('test-addEventListener', function (data) {
    // console.log('订阅发布测试2-on订阅\n', data);
});
event.addEventListener('test-addEventListener', test1);
event.addEventListener('test-addEventListener', test2);
event.addEventListener('test-addEventListener', test2);
event.emit('test-addEventListener', {name: 'addEventListener1'});
event.off('test-addEventListener', 1);
event.removeEventListener('test-addEventListener', test1, 1);
event.removeEventListener('test-addEventListener', test2, 1);
// event.off('test-addEventListener', 2, test2); // 和下面一行是同等功能
// event.removeEventListener('test-addEventListener', test2, 2); // 和上面一行是同等功能
event.emit('test-addEventListener', {name: 'addEventListener2'});

// result
/*
[
    {name: 'addEventListener1'},
    {name: 'addEventListener1'},
    {name: 'addEventListener1'},
    {name: 'addEventListener1'},
    {name: 'addEventListener2'},
]
*/
```
