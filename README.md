# gongik-ars
산업기능요원 퇴근기록 확인을 위한 ARS 스크립트

## Prerequisite
- Twilio에서 전화 발신이 가능하도록 설정이 되어 있어야 합니다.
- Twilio에서 webhook url 등록이 필요합니다. 본 스크립트를 실행한 웹서버 주소를 Twilio 콘솔에서 등록해주세요.
- 실행 전 환경변수를 먼저 설정해주세요.

## Install & Start
```bash
# 라이브러리 설치
npm install

# Express 앱 실행
npm start
```

### 전화 걸기
전화번호가 `010-1234-5678`번일 경우 아래와 같이 실행합니다.
```bash
curl -X POST https://example-twilio-webhook.com/call?to=1012345678
```

### 실행시 포트 번호 수정
기본적으로 포트 번호는 `3008`번으로 설정되어 있습니다. 서버 설정에 맞게 적절히 포트 번호를 수정해서 사용하세요.
```js
app.listen(3008, () => {
  console.log("Server listening on port 3008");
});
```

## Environment Variables
```
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""
API_BASE_URL=""
```