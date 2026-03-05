#include <WiFi.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include <HTTPClient.h>

/************ BACKEND SETTINGS ************/
const char* serverUrl = "http://10.39.59.119:5000/api/streetlight-data"; // Laptop IP
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 5000; // Send data every 5 seconds

/************ WIFI ************/
const char *ssid = "Sharvil";
const char *password = "12345678";

// WiFi Server object and parameters
WebServer server(80);

/************ PIN DEFINITIONS ************/
#define ACS1_PIN 33
#define RELAY1_PIN 19

#define ACS2_PIN 32
#define RELAY2_PIN 21

#define ACS3_PIN 35
#define RELAY3_PIN 22

#define ACS4_PIN 34
#define RELAY4_PIN 23

/************ SETTINGS ************/
//SENSITIVITY=(0.185*(2.0/3.0))=0.123
#define SENSITIVITY 0.123  //0.100
#define NOISE_THRESHOLD 0.01
#define OVERCURRENT_LIMIT 1.0
#define LOAD_ON_THRESHOLD 0.15   // A (lowered to accommodate sensor variation)
#define LOAD_OFF_THRESHOLD 0.08  // A (must be lower than ON)

/************ GLOBAL VARIABLES ************/
float offset1, offset2, offset3, offset4;
float current1, current2, current3, current4;
int raw1, raw2, raw3, raw4;
float voltage1, voltage2, voltage3, voltage4;
String status1, status2, status3, status4;
bool loadState1 = false;
bool loadState2 = false;
bool loadState3 = false;
bool loadState4 = false;
/************ SETUP ************/
void setup() {

  Serial.begin(115200);

  pinMode(RELAY1_PIN, OUTPUT);
  pinMode(RELAY2_PIN, OUTPUT);
  pinMode(RELAY3_PIN, OUTPUT);
  pinMode(RELAY4_PIN, OUTPUT);

  // ACTIVE LOW RELAYS OFF
  digitalWrite(RELAY1_PIN, LOW);
  digitalWrite(RELAY2_PIN, LOW);
  digitalWrite(RELAY3_PIN, LOW);
  digitalWrite(RELAY4_PIN, LOW);

  delay(3000);  // Allow voltage stabilization

  analogReadResolution(12);
  analogSetPinAttenuation(ACS1_PIN, ADC_11db);
  analogSetPinAttenuation(ACS2_PIN, ADC_11db);
  analogSetPinAttenuation(ACS3_PIN, ADC_11db);
  analogSetPinAttenuation(ACS4_PIN, ADC_11db);
  delay(100);  // Allow voltage stabilization
  Serial.println("Calibrating 4 Sensors...");

  offset1 = calibrateOffset(ACS1_PIN);
  offset2 = calibrateOffset(ACS2_PIN);
  offset3 = calibrateOffset(ACS3_PIN);
  offset4 = calibrateOffset(ACS4_PIN);

  Serial.println("Offsets:");
  Serial.println(offset1);
  Serial.println(offset2);
  Serial.println(offset3);
  Serial.println(offset4);

  // Turn all relays ON
  digitalWrite(RELAY1_PIN, HIGH);
  digitalWrite(RELAY2_PIN, HIGH);
  digitalWrite(RELAY3_PIN, HIGH);
  digitalWrite(RELAY4_PIN, HIGH);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  Serial.println("\nWiFi Connected");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  /* ================= mDNS START ================= */
  if (MDNS.begin("streetlight")) {  // hostname = streetlight.local
    Serial.println("mDNS responder started");
    MDNS.addService("http", "tcp", 80);
    Serial.println("Open browser: http://streetlight.local");
  } else {
    Serial.println("Error setting up mDNS!");
  }
  /* ============================================== */

  server.on("/", handleRoot);
  server.on("/relay", handleRelay);
  server.begin();
}

/************ LOOP ************/
void loop() {

  server.handleClient();

  readChannel(ACS1_PIN, offset1, raw1, voltage1, current1);
  readChannel(ACS2_PIN, offset2, raw2, voltage2, current2);
  readChannel(ACS3_PIN, offset3, raw3, voltage3, current3);
  readChannel(ACS4_PIN, offset4, raw4, voltage4, current4);

  handleChannel(current1, RELAY1_PIN, status1, loadState1);
  handleChannel(current2, RELAY2_PIN, status2, loadState2);
  handleChannel(current3, RELAY3_PIN, status3, loadState3);
  handleChannel(current4, RELAY4_PIN, status4, loadState4);

  // Send data to backend periodically
  if (millis() - lastSendTime > sendInterval) {
    sendDataToBackend();
    lastSendTime = millis();
  }

  delay(100);
}

void sendDataToBackend() {
  if (WiFi.status() == WL_CONNECTED) {
    sendChannelData("SL-01", voltage1, current1, status1, (digitalRead(RELAY1_PIN) == HIGH));
    sendChannelData("SL-02", voltage2, current2, status2, (digitalRead(RELAY2_PIN) == HIGH));
    sendChannelData("SL-03", voltage3, current3, status3, (digitalRead(RELAY3_PIN) == HIGH));
    sendChannelData("SL-04", voltage4, current4, status4, (digitalRead(RELAY4_PIN) == HIGH));
  }
}

void sendChannelData(String id, float voltage, float current, String status, bool relayState) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String json = "{";
    json += "\"streetlightId\":\"" + id + "\",";
    json += "\"voltage\":" + String(voltage, 3) + ",";
    json += "\"current\":" + String(current, 3) + ",";
    json += "\"status\":\"" + status + "\",";
    json += "\"relayState\":" + String(relayState ? "true" : "false");
    json += "}";

    int httpResponseCode = http.POST(json);
    
    if (httpResponseCode > 0) {
      Serial.print("Data sent to backend for " + id + ". Response: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error sending data for " + id + ". Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
}

/************ CHANNEL READING ************/
void readChannel(int pin, float offset, int &raw, float &voltage, float &current) {

  raw = getAveragedADC(pin, 1000);
  voltage = (raw / 4095.0) * 3.3;
  current = abs((voltage - offset) / SENSITIVITY);

  if (current < NOISE_THRESHOLD)
    current = 0;
}

/************ PROTECTION ************/
// void handleChannel(float current, int relayPin, String &status, bool &loadState) {

//   if (current > OVERCURRENT_LIMIT) {
//     digitalWrite(relayPin, LOW);  // OFF
//     status = "🚨 OVERCURRENT! Relay OFF";
//     loadState = false;
//     return;
//   }
//   // Hysteresis
//   if (!loadState && current > LOAD_ON_THRESHOLD) {
//     loadState = true;
//   } else if (loadState && current < LOAD_OFF_THRESHOLD) {
//     loadState = false;
//   }

//   if (!loadState) {
//     status = "OFF / No Load";
//   } else {
//     status = "NORMAL Operation";
//   }
// }

void handleChannel(float current, int relayPin, String &status, bool &loadState) {

  bool relayOn = (digitalRead(relayPin) == HIGH);  // active HIGH relay

  // 1️⃣ Overcurrent protection
  if (current > OVERCURRENT_LIMIT) {
    digitalWrite(relayPin, HIGH);  // turn OFF
    status = "🚨 OVERCURRENT! Relay OFF";
    loadState = false;
    return;
  }

  // 2️⃣ Hysteresis only when relay is ON
  if (relayOn) {
    if (!loadState && current > LOAD_ON_THRESHOLD) {
      loadState = true;
    } else if (loadState && current < LOAD_OFF_THRESHOLD) {
      loadState = false;
    }
  } else {
    loadState = false;  // relay OFF means no load
  }

  // 3️⃣ Status logic
  if (!relayOn) {
    status = "Relay OFF";
  } else if (!loadState) {
    status = "⚠ STREETLIGHT FAULTY";
  } else {
    status = "NORMAL Operation";
  }
}


/************ WEB PAGE ************/
void handleRoot() {
  server.send(200, "text/plain", "Streetlight Controller Online. Telemetry is being sent to the central dashboard.");
}

/************ HTML HELPER ************/
void addBox(String &html, String title, int raw, float voltage,
            float offset, float current, String status, int relayPin, int ch) {

  html += "<div class='box'>";
  html += "<h3>" + title + "</h3>";
  html += "<p><b>Raw ADC:</b> " + String(raw) + "</p>";
  html += "<p><b>Voltage:</b> " + String(voltage, 3) + " V</p>";
  html += "<p><b>Offset:</b> " + String(offset, 3) + " V</p>";
  html += "<p><b>Current:</b> " + String(current, 3) + " A</p>";
  html += "<p><b>Status:</b> " + status + "</p>";
  html += "<p><b>Relay:</b> ";
  html += (digitalRead(relayPin) == LOW ? "OFF" : "ON");
  html += "</p>";

  html += "<p>";
  html += "<a href='/relay?ch=" + String(ch) + "&state=on'><button>ON</button></a> ";
  html += "<a href='/relay?ch=" + String(ch) + "&state=off'><button>OFF</button></a>";
  html += "</p>";

  html += "</div>";
}

void handleRelay() {

  if (!server.hasArg("ch") || !server.hasArg("state")) {
    server.send(400, "text/plain", "Missing Parameters");
    return;
  }

  int ch = server.arg("ch").toInt();
  String state = server.arg("state");

  int relayPin;

  switch (ch) {
    case 1: relayPin = RELAY1_PIN; break;
    case 2: relayPin = RELAY2_PIN; break;
    case 3: relayPin = RELAY3_PIN; break;
    case 4: relayPin = RELAY4_PIN; break;
    default:
      server.send(400, "text/plain", "Invalid Channel");
      return;
  }

  digitalWrite(relayPin, state == "on" ? HIGH : LOW);  // active HIGH

  server.sendHeader("Location", "/");
  server.send(303);
}

/************ CALIBRATION ************/
float calibrateOffset(int pin) {

  long sum = 0;
  for (int i = 0; i < 800; i++) {
    sum += analogRead(pin);
    delay(2);
  }

  float avg = sum / 800.0;
  return (avg / 4095.0) * 3.3;
}

/************ ADC AVERAGING ************/
int getAveragedADC(int pin, int samples) {

  long sum = 0;
  for (int i = 0; i < samples; i++) {
    sum += analogRead(pin);
  }

  return sum / samples;
}
