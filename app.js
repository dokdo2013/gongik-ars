require("dotenv").config();
const express = require("express");
const app = express();
const twilio = require("twilio");
const VoiceResponse = twilio.twiml.VoiceResponse;

const apiBaseUrl = process.env.API_BASE_URL;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

app.use(express.urlencoded({ extended: false }));

function makeCall(toPhone) {
  client.calls
    .create({
      url: `${apiBaseUrl}/voice?to=${encodeURIComponent(toPhone)}`,
      to: `+82${toPhone}`,
      from: fromPhone,
    })
    .then((call) => console.log(`Call initiated with ID: ${call.sid}`))
    .catch((err) => console.error(err));
}

app.post("/voice", (req, res) => {
  const pressedKey = req.body.Digits;
  const toPhone = req.query.to;
  const response = new VoiceResponse();

  if (!pressedKey) {
    const gather = response.gather({
      input: "dtmf",
      timeout: 10,
      numDigits: 1,
      action: `/voice?to=${encodeURIComponent(toPhone)}`,
    });
    gather.say(
      "산업기능요원 퇴근 기록은 하셨나요? 기록했다면 1번, 찍는 날이 아니라면 2번, 잠시 후 찍겠다면 3번을 눌러주세요.",
      { language: "ko-KR" }
    );
  } else if (!["1", "2", "3"].includes(pressedKey)) {
    response.say("잠시 후에 다시 확인하겠습니다.", { language: "ko-KR" });
    response.hangup();
    setTimeout(() => makeCall(toPhone), 3 * 60 * 1000);
  } else if (pressedKey === "3") {
    response.say("잠시 후에 다시 확인하겠습니다.", { language: "ko-KR" });
    response.hangup();
    setTimeout(() => makeCall(toPhone), 5 * 60 * 1000);
  } else {
    response.say("확인되었습니다.", { language: "ko-KR" });
    response.hangup();
  }

  res.type("text/xml");
  res.send(response.toString());
});

app.post("/call", (req, res) => {
  const toPhone = req.query.to;
  if (!toPhone) {
    res.status(400).send('Missing "to" parameter');
    return;
  }

  makeCall(toPhone);
  res.status(200).send("Phone call initiated");
});

app.listen(3008, () => {
  console.log("Server listening on port 3008");
});
