#include <BleMouse.h>
#include <Wire.h>
#include <I2Cdev.h>
#include <MPU6050.h>

MPU6050 mpu;
BleMouse bleMouse("AirMouse", "ESP32", 100);

// --- Tuning parameters ---
float sensitivity = 1.1;
int deadzone = 30;              // RAW gyro deadzone (important)
float dwellSec = 1.5;
int flickThreshold = 16000;

// --- Cursor smoothing ---
static int avgDx = 0, avgDy = 0;
unsigned long dwellStart = 0;
bool dwellArmed = false;

// --- Gyro offsets ---
long gxOffset = 0, gyOffset = 0, gzOffset = 0;

void calibrateGyro() {
  Serial.println("⚙️ Calibrating gyro... Keep device STILL");
  long gxSum = 0, gySum = 0, gzSum = 0;

  for (int i = 0; i < 500; i++) {
    int16_t ax, ay, az, gx, gy, gz;
    mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
    gxSum += gx;
    gySum += gy;
    gzSum += gz;
    delay(5);
  }

  gxOffset = gxSum / 500;
  gyOffset = gySum / 500;
  gzOffset = gzSum / 500;

  Serial.println("✅ Gyro calibration done");
}

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);

  mpu.initialize();
  mpu.setSleepEnabled(false);

  calibrateGyro();     // ⭐ IMPORTANT

  bleMouse.begin();
  Serial.println("AirMouse READY");
}

void loop() {
  if (!bleMouse.isConnected()) return;

  int16_t ax, ay, az, gx, gy, gz;
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  // --- Apply offsets ---
  gx -= gxOffset;
  gy -= gyOffset;
  gz -= gzOffset;

  // --- Hard deadzone on RAW gyro ---
  if (abs(gx) < deadzone) gx = 0;
  if (abs(gy) < deadzone) gy = 0;

  // --- Cursor movement ---
  int dx = gx / 350;     // lowered sensitivity
  int dy = -gy / 350;

  // --- Smoothing ---
  avgDx = (avgDx * 7 + dx) / 8;
  avgDy = (avgDy * 7 + dy) / 8;

  int moveX = avgDx * sensitivity;
  int moveY = avgDy * sensitivity;

  bleMouse.move(moveX, moveY);

  // --- LEFT CLICK (steady hold) ---
  if (abs(moveX) < 1 && abs(moveY) < 1) {
    if (!dwellArmed) {
      dwellArmed = true;
      dwellStart = millis();
    } else if (millis() - dwellStart > dwellSec * 1000) {
      bleMouse.click(MOUSE_LEFT);
      Serial.println("LEFT CLICK");
      dwellArmed = false;
    }
  } else {
    dwellArmed = false;
  }

  // --- RIGHT CLICK (flick/twist) ---
  if (abs(gz) > flickThreshold) {
    bleMouse.click(MOUSE_RIGHT);
    Serial.println("RIGHT CLICK");
    avgDx = avgDy = 0;
    delay(200);
  }

  delay(10);
}
