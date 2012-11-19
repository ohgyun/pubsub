/**
 * 익스텐션과 컨텐트 스크립트의 커뮤니케이션을 담당하는 모듈
 * 
 * 크롬에서 이미 메시징 API를 제공하고 있지만,
 * (http://developer.chrome.com/extensions/messaging.html)
 * 익스텐션과 컨텐트 스크립트에서의 호출 방식이 달라 좀 혼란스럽다.
 *
 * 익스텐션과 컨텐트 스크립트의 구분 없이 간편하게 사용할 수 있도록,
 * Pub/Sub 스타일로 추상화한다.
 *
 * @module pubsub
 * @author ohgyun@gmail.com
 * @version 2012.10.27
 */
(function () {
  
  'use strict';
  
  var
    // 메시지를 보관할 맵
    // {
    //    key: [ callback, callback, ...],
    //    key: [ ... ]
    // } 형태로 보관한다.
    _map = {},
    
    // 메시지 값을 저장할 스트링
    MSG_KEY = '_key_';

  /**
   * 메시지를 발행(publish)한다.
   *
   * 메시지는 반드시 '명령형'이 아닌, '완료형'으로 보낸다.
   *   예) '단어를 검색하라' 대신, '단어가 검색됐다'를 사용한다.
   *       'ext.searchWord' 대신, 'ext.wordSearched'를 사용한다.
   *
   * @param {string} msg 전달할 메시지명, 아래 컨벤션을 따른다.
   *    ext.* 형태이면, 익스텐션에서 발생한 메시지이다.
   *    cscript.* 형태이면, 컨텐트 스크립트에서 발생한 메시지이다.
   * @param {object} data 전달할 데이터
   */
  function pub(msg, data) {
    data = data || {};
    data[MSG_KEY] = msg;
    
    // 익스텐션과 컨텐트 스크립트 양쪽으로 메시지를 보낸다.
    tryToPubToExtension(msg, data);
    tryToPubToContentScript(msg, data);
  }
  
  /**
   * 익스텐션으로 메시지를 보내는 것을 시도한다.
   * @param {string} msg 메시지명
   * @param {object} data 전달할 데이터
   */
  function tryToPubToExtension(msg, data) {
    chrome.extension.sendMessage(data);
  }
  
  /**
   * 컨텐트 스크립트로 메시지를 보내는 것을 시도한다.
   * @param {string} msg 메시지명
   * @param {object} data 전달할 데이터
   */
  function tryToPubToContentScript(msg, data) {
    if (chrome.tabs) { // chrome.tabs 속성은 익스텐션에서만 갖는다.
      // 현재 활성화되어 있는 탭에만 메시지를 보낸다.
      chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, data);
      });
    }
  }
  
  /**
   * 메시지를 구독(subscribe)한다.
   * 구독할 메시지를 키값으로, 맵에 콜백을 저장한다.
   *
   * @param {string} msg 메시지명
   * @param {function (data)} callback
   */
  function sub(msg, callback) {
    _map[msg] = _map[msg] || [];
    _map[msg].push(callback);
  }
  
  /**
   * 익스텐션 메시지의 리스너를 등록한다.
   */
  function registerListener() {
    chrome.extension.onMessage.addListener(
      function(request, sender, sendResponse) {
        // 탭 아이디는 컨텐트 스크립트에서 보낼 때에만 존재한다.
        request.tabId = sender.tab && sender.tab.id || ''; 
        onResponse(request);
        // sendResponse는 사용하지 않는다.
      }
    );
  }
  
  /**
   * 메시지를 받아 처리한다.
   * 전달받은 데이터에 저장되어 있는 메시지값(KEY_MSG 속성)으로
   * 호출할 콜백을 찾는다.
   */
  function onResponse(data) {
    var callbacks = _map[data[MSG_KEY]];
    if (callbacks) {
      callbacks.forEach(function (cb) {
        cb(data);
      }); 
    }
  }
  
  
  // 모듈이 로드되면, 리스너를 등록한다.
  registerListener();
  
  
  // Export Module
  //--------------
  
  var pubsub = {
    pub: pub,
    sub: sub
  };
  
  // RequireJS를 사용하는 경우, define으로 정의하고
  if (typeof define === 'function' && define.amd) {
     define(function () { return pubsub; });
  
  // 없다면 전역으로 노출한다.
  } else {
    window.pubsub = pubsub; 
  }
  
}());