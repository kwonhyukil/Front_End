<template>
    <div class="not-found-container">
      <h1>🚧 404 - 페이지를 찾을 수 없습니다.</h1>
      <p>요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      <router-link to="/home" class="home-link">🏠 홈으로 돌아가기</router-link>
    </div>
  </template>
  
  <style scoped>
  .not-found-container {
    text-align: center;
    margin-top: 50px;
  }
  h1 {
    font-size: 2em;
    color: #ff5252;
  }
  p {
    margin-top: 10px;
    font-size: 1.2em;
  }
  .home-link {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #2196f3;
    color: white;
    text-decoration: none;
    border-radius: 5px;
  }
  </style>
  