# coin_trading

1. 텔레그램 접속후 botfater > 채팅방 생성 (/newbot)
2. 전달받은 token을 넣어서 아래 주소로 이동
   https://api.telegram.org/bot{{token}}/getUpdates
3. 채팅방에 아무 채팅이나 전송 후 위의 주소 새로고침
4. 새로고침된 화면의 id 값이 TELEGRAM_CHAT_ID 가 된다
