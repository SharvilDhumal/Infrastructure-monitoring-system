#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi Credentials
const char* ssid = "Sharvil";
const char* password = "12345678";

// Backend Server URL
// IMPORTANT: Replace with your computer's local IP address if testing locally
const char* serverUrl = "http://10.26.229.119:5001/api/streetlight-data";

// Pin Definitions
// Current Sensors (ACS712) - Analog Pins
const int currentSensorPins[4] = {34, 35, 32, 33}; 
// Relay Control Pins - Digital Output
const int relayPins[4] = {26, 27, 14, 12};
// Voltage Sensor Pin (ZMPT101B or similar) - Analog Pin
// Assuming 1 voltage sensor for the main line for simplicity, or modify for 4 if needed
const int voltageSensorPin = 36; 

// Calibration Constants
const float VCC = 3.3; // ESP32 ADC reference voltage
const float ADC_SCALE = 4095.0;
const float SENSITIVITY = 0.185; // mV/A for ACS712 5A module (change to 0.100 for 20A, 0.066 for 30A)
const float ACTUAL_MAINS_VOLTAGE = 230.0; // Expected mains voltage

// Global Variables
float current[4] = {0, 0, 0, 0};
float voltage = 0;
bool relayState[4] = {false, false, false, false}; // false = OFF, true = ON
String streetLightIds[4] = {"SL-01", "SL-02", "SL-03", "SL-04"};

void setup() {
  Serial.begin(115200);

  // Initialize Pins
  for (int i = 0; i < 4; i++) {
    pinMode(currentSensorPins[i], INPUT);
    pinMode(relayPins[i], OUTPUT);
    digitalWrite(relayPins[i], LOW); // Start with Relays OFF
  }
  pinMode(voltageSensorPin, INPUT);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // 1. Read Sensors
  readSensors();

  // 2. Control Logic (Example: Turn ON if simple condition met, or controlled via API in future)
  // For now, let's keep them ON for demonstration or toggle based on logic
  // Here we just read the actual state of the pin
  for(int i=0; i<4; i++) {
     relayState[i] = digitalRead(relayPins[i]);
  }

  // 3. Send Data to Server
  if (WiFi.status() == WL_CONNECTED) {
    for (int i = 0; i < 4; i++) {
      sendData(i);
      delay(100); // Small delay between requests
    }
  } else {
    Serial.println("WiFi Disconnected");
  }

  // 4. Wait for 2 seconds
  delay(2000);
}

void readSensors() {
  // Read Voltage (Simplified AC reading)
  // In a real scenario, you need RMS calculation
  int voltageRaw = analogRead(voltageSensorPin);
  // Dummy conversion for demo - replace with proper ZMPT101B RMS calculation library
  voltage = (voltageRaw / ADC_SCALE) * ACTUAL_MAINS_VOLTAGE; 
  // Ensure we don't show noise as voltage
  if (voltage < 5.0) voltage = 0.0; 

  // Read Current for each channel
  for (int i = 0; i < 4; i++) {
    // RMS Current Calculation
    float sumCurrent = 0;
    for (int j = 0; j < 100; j++) {
      int adcVal = analogRead(currentSensorPins[i]);
      float voltageVal = (adcVal / ADC_SCALE) * VCC;
      // Offset is typically VCC/2 = 1.65V for bi-directional sensors
      // You might need to calibrate the zero point (offset)
      float offset = 1.65; 
      float currentInst = (voltageVal - offset) / SENSITIVITY;
      sumCurrent += currentInst * currentInst;
      delay(1);
    }
    float currentRMS = sqrt(sumCurrent / 100);
    
    // Filter noise
    if (currentRMS < 0.1) currentRMS = 0.0;
    
    current[i] = currentRMS;
  }
}

void sendData(int id) {
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  // Prepare JSON payload
  StaticJsonDocument<200> doc;
  doc["streetlightId"] = streetLightIds[id];
  doc["voltage"] = voltage;
  doc["current"] = current[id];
  doc["power"] = voltage * current[id]; // Apparent Power
  doc["status"] = (current[id] > 0.1) ? "ON" : "OFF"; // Basic status inference
  doc["relayState"] = relayState[id];

  String requestBody;
  serializeJson(doc, requestBody);

  int httpResponseCode = http.POST(requestBody);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    Serial.println(response);
  } else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
}
