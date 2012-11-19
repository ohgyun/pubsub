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


