# 事件发布/订阅模式
```
// 订阅
event.on('hehe', function (data) {
    console.log(data); // {a: 1, b: 2}
});
// 发布
event.emit('hehe', {a: 1, b: 2});
```
