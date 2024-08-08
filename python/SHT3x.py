import smbus2
import time

class SHT3x:
    def __init__(self, address, value_if_error=0.0, sensor_type="SHT30", mode="Single_HighRep_ClockStretch"):
        self._address = address
        self._value_if_error = value_if_error
        self._sensor_type = sensor_type
        self._last_update_time = 0
        self._update_interval_ms = 1000  # Default update interval
        self._timeout_ms = 500  # Default timeout
        self.set_mode(mode)
        self._bus = smbus2.SMBus(1)  # Default I2C bus on Raspberry Pi
        self._temperature_calibration = {'factor': 1.0, 'shift': 0.0}
        self._humidity_calibration = {'factor': 1.0, 'shift': 0.0}

    def update_data(self):
        self._send_command(self._meas_msb, self._meas_lsb)
        time.sleep(0.015)  # Wait for measurement to be ready
        data = self._bus.read_i2c_block_data(self._address, 0x00, 6)

        if self._check_crc(data[0:2], data[2]) and self._check_crc(data[3:5], data[5]):
            temperature_raw = data[0] << 8 | data[1]
            humidity_raw = data[3] << 8 | data[4]

            self._temperature_c = temperature_raw * 0.00267033 - 45
            self._temperature_c = self._temperature_c * self._temperature_calibration['factor'] + self._temperature_calibration['shift']
            
            self._rel_humidity = humidity_raw * 0.0015259
            self._rel_humidity = self._rel_humidity * self._humidity_calibration['factor'] + self._humidity_calibration['shift']
            
            self._error = None
            self._last_update_time = time.time() * 1000
        else:
            self._error = "DataCorrupted"

    def get_temperature(self, scale="Celsius"):
        temperature = self._temperature_c
        if scale == "Kelvin":
            temperature += 273.15
        elif scale == "Fahrenheit":
            temperature = temperature * 1.8 + 32
        return self._handle_error(temperature)

    def get_rel_humidity(self):
        return self._handle_error(self._rel_humidity)

    def set_mode(self, mode):
        mode_map = {
            "Single_HighRep_ClockStretch": (0x2C, 0x06),
            "Single_MediumRep_ClockStretch": (0x2C, 0x0D),
            "Single_LowRep_ClockStretch": (0x2C, 0x10),
            "Single_HighRep_NoClockStretch": (0x24, 0x00),
            "Single_MediumRep_NoClockStretch": (0x24, 0x0B),
            "Single_LowRep_NoClockStretch": (0x24, 0x16)
        }
        self._meas_msb, self._meas_lsb = mode_map.get(mode, mode_map["Single_HighRep_ClockStretch"])

    def set_temperature_calibration(self, factor, shift):
        self._temperature_calibration['factor'] = factor
        self._temperature_calibration['shift'] = shift

    def set_humidity_calibration(self, factor, shift):
        self._humidity_calibration['factor'] = factor
        self._humidity_calibration['shift'] = shift

    def soft_reset(self):
        self._send_command(0x30, 0xA2)

    def heater_on(self):
        self._send_command(0x30, 0x6D)

    def heater_off(self):
        self._send_command(0x30, 0x66)

    def set_update_interval(self, interval_ms):
        self._update_interval_ms = max(interval_ms, 1)

    def set_timeout(self, timeout_ms):
        self._timeout_ms = max(timeout_ms, 1)

    def _send_command(self, msb, lsb):
        self._bus.write_i2c_block_data(self._address, msb, [lsb])

    def _check_crc(self, data: bytes, crc_target):
        # Initialization
        crc = 0xFF
        # Polynomial for CRC-8: 0x31 (x^8 + x^5 + x^4 + 1)
        poly = 0x31
        # Process each byte in the data
        for byte in data:
            crc ^= byte  # XOR with the byte
            # Process each bit
            for _ in range(8):
                if crc & 0x80:  # If the MSB is set
                    crc = (crc << 1) ^ poly  # Shift left and XOR with polynomial
                else:
                    crc <<= 1  # Just shift left
                crc &= 0xFF  # Ensure CRC is 8-bit
        crc ^= 0x00
        return crc==crc_target

    def _handle_error(self, value):
        return value if not self._error else self._value_if_error
