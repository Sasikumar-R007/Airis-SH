// BLE Service for Emergency Alert Detection
// Detects emergency alerts from ESP32 hardware via BLE

interface EmergencyAlertCallback {
  onEmergencyDetected: () => void
}

class BleEmergencyService {
  private device: BluetoothDevice | null = null
  private server: BluetoothRemoteGATTServer | null = null
  private service: BluetoothRemoteGATTService | null = null
  private emergencyChar: BluetoothRemoteGATTCharacteristic | null = null
  private isConnected = false
  private callbacks: EmergencyAlertCallback | null = null

  // BLE Service UUIDs for Emergency Alert
  private readonly EMERGENCY_SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb'
  private readonly EMERGENCY_CHAR_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb'
  private readonly DEVICE_NAME_PREFIX = 'AirMouse' // Match your ESP32 device name

  /**
   * Connect to the Airis-SH device via BLE
   */
  async connect(): Promise<boolean> {
    try {
      if (!navigator.bluetooth) {
        console.error('Web Bluetooth API not supported in this browser')
        return false
      }

      // Request device connection
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: this.DEVICE_NAME_PREFIX }],
        optionalServices: [this.EMERGENCY_SERVICE_UUID]
      })

      console.log('Device selected:', this.device.name)

      // Connect to GATT server
      if (!this.device.gatt) {
        throw new Error('GATT server not available')
      }

      this.server = await this.device.gatt.connect()
      console.log('Connected to GATT server')

      // Get emergency service
      this.service = await this.server.getPrimaryService(this.EMERGENCY_SERVICE_UUID)
      console.log('Emergency service found')

      // Get emergency characteristic
      this.emergencyChar = await this.service.getCharacteristic(this.EMERGENCY_CHAR_UUID)
      console.log('Emergency characteristic found')

      // Subscribe to notifications
      await this.emergencyChar.startNotifications()
      this.emergencyChar.addEventListener('characteristicvaluechanged', this.handleEmergencyAlert.bind(this))

      // Handle disconnection
      this.device.addEventListener('gattserverdisconnected', this.handleDisconnection.bind(this))

      this.isConnected = true
      console.log('✅ Emergency monitoring active')
      return true
    } catch (error) {
      console.error('Failed to connect to device:', error)
      this.isConnected = false
      return false
    }
  }

  /**
   * Disconnect from the device
   */
  async disconnect(): Promise<void> {
    try {
      if (this.emergencyChar) {
        await this.emergencyChar.stopNotifications()
      }
      if (this.server) {
        this.server.disconnect()
      }
      this.isConnected = false
      console.log('Disconnected from device')
    } catch (error) {
      console.error('Error disconnecting:', error)
    }
  }

  /**
   * Handle emergency alert notification from device
   */
  private handleEmergencyAlert(event: Event): void {
    const characteristic = event.target as BluetoothRemoteGATTCharacteristic
    const value = characteristic.value

    if (!value) return

    // Read the value (assuming it's a single byte: 0 = no alert, 1 = emergency)
    const dataView = new DataView(value.buffer)
    const alertValue = dataView.getUint8(0)

    console.log('Emergency alert received:', alertValue)

    if (alertValue === 1) {
      // Emergency detected!
      console.log('🚨 EMERGENCY ALERT TRIGGERED!')
      if (this.callbacks?.onEmergencyDetected) {
        this.callbacks.onEmergencyDetected()
      }
    }
  }

  /**
   * Handle device disconnection
   */
  private handleDisconnection(): void {
    console.log('Device disconnected')
    this.isConnected = false
    // Optionally attempt to reconnect
    // this.reconnect()
  }

  /**
   * Set callbacks for emergency events
   */
  setCallbacks(callbacks: EmergencyAlertCallback): void {
    this.callbacks = callbacks
  }

  /**
   * Check if currently connected
   */
  getConnected(): boolean {
    return this.isConnected
  }

  /**
   * Get device name
   */
  getDeviceName(): string | null {
    return this.device?.name || null
  }
}

// Export singleton instance
export const bleEmergencyService = new BleEmergencyService()

