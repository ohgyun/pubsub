pubsub
======
A simple Pub/Sub module for chrome extension


크롬 익스텐션 개발 시,  
익스텐션과 컨텐트 스크립트 간의 메시지 전달을 위한 Pub/Sub 모듈입니다.  

크롬에서 이미 메시징 API를 제공하고 있지만,  
(http://developer.chrome.com/extensions/messaging.html)  
익스텐션과 컨텐트 스크립트에서의 호출 방식이 달라 약간 혼란스럽습니다.  

pubsub는 익스텐션과 컨텐트 스크립트의 구분 없이,  
간편하게 메시지를 전달할 수 있는 간단한 Pub/Sub 방식의 모듈입니다.


## 사용하기
pubsub.js 를 백그라운드와 컨텐트 스크립트 양쪽에 모두 추가합니다.  
모듈은 `window.pubsub` 로 할당하며,  
RequireJS를 사용하고 있다면 전역변수 대신 모듈로 define 합니다.


## pubsub.pub(msg, data)
메시지를 발행(publish)합니다.  
메시지는 익스텐션과 현재 활성화되어 있는 탭의 컨텐트 스크립트로 전달됩니다.

### Parameters
- msg {string} 메시지명
- data {any} 전달할 데이터

### Usage
```
pubsub.pub('foo', { 'bar': 'abc' });
```

## pubsub.sub(msg, callback)
메시지를 구독(subscribe)합니다.

### Parameters
- msg {string} 메시지명
- callback {function(data)} 메시지를 받은 경우 실행할 콜백

### Usage
```
pubsub.sub('foo', function (data) {
  console.log(data); //--> { 'bar': 'abc' }
});
```

