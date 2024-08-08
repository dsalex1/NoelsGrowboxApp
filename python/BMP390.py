# SPDX-FileCopyrightText: 2018 Carter Nelson for Adafruit Industries
#
# SPDX-License-Identifier: MIT

"""
`bmp3xx_smbus`
====================================================

Python driver for BMP388 Temperature and Barometric Pressure sensor using smbus2.

* Author(s): Carter Nelson, ChatGPT

Implementation Notes
--------------------

**Hardware:**

* `Adafruit BMP388 - Precision Barometric Pressure and Altimeter
  <https://www.adafruit.com/product/3966>`_ (Product ID: 3966)

**Software and Dependencies:**

* Python 3
* `smbus2` library
"""

import struct
import time
from smbus2 import SMBus

_BMP388_CHIP_ID = 0x50
_BMP390_CHIP_ID = 0x60

_REGISTER_CHIPID = 0x00
_REGISTER_STATUS = 0x03
_REGISTER_PRESSUREDATA = 0x04
_REGISTER_TEMPDATA = 0x07
_REGISTER_CONTROL = 0x1B
_REGISTER_OSR = 0x1C
_REGISTER_ODR = 0x1D
_REGISTER_CONFIG = 0x1F
_REGISTER_CAL_DATA = 0x31
_REGISTER_CMD = 0x7E

_OSR_SETTINGS = (1, 2, 4, 8, 16, 32)  # pressure and temperature oversampling settings
_IIR_SETTINGS = (0, 2, 4, 8, 16, 32, 64, 128)  # IIR filter coefficients


class BMP390:
    """Base class for BMP3XX sensor."""

    def __init__(self, i2c_address=0x77, i2c_bus=1):
        self._i2c_address = i2c_address
        self._i2c_bus = SMBus(i2c_bus)
        chip_id = self._read_byte(_REGISTER_CHIPID)
        if chip_id not in (_BMP388_CHIP_ID, _BMP390_CHIP_ID):
            raise RuntimeError(f"Failed to find BMP3XX! Chip ID {hex(chip_id)}")
        self._read_coefficients()
        self.reset()
        self.sea_level_pressure = 1013.25
        self._wait_time = 0.002  # change this value to have faster reads if needed

    @property
    def pressure(self) -> float:
        """The pressure in hPa."""
        return self._read()[0] / 100

    @property
    def temperature(self) -> float:
        """The temperature in degrees Celsius"""
        return self._read()[1]

    @property
    def altitude(self) -> float:
        """The altitude in meters based on the currently set sea level pressure."""
        return 44307.7 * (1 - (self.pressure / self.sea_level_pressure) ** 0.190284)

    @property
    def pressure_oversampling(self) -> int:
        """The pressure oversampling setting."""
        return _OSR_SETTINGS[self._read_byte(_REGISTER_OSR) & 0x07]

    @pressure_oversampling.setter
    def pressure_oversampling(self, oversample: int) -> None:
        if oversample not in _OSR_SETTINGS:
            raise ValueError(f"Oversampling must be one of: {_OSR_SETTINGS}")
        new_setting = self._read_byte(_REGISTER_OSR) & 0xF8 | _OSR_SETTINGS.index(
            oversample
        )
        self._write_register_byte(_REGISTER_OSR, new_setting)

    @property
    def temperature_oversampling(self) -> int:
        """The temperature oversampling setting."""
        return _OSR_SETTINGS[self._read_byte(_REGISTER_OSR) >> 3 & 0x07]

    @temperature_oversampling.setter
    def temperature_oversampling(self, oversample: int) -> None:
        if oversample not in _OSR_SETTINGS:
            raise ValueError(f"Oversampling must be one of: {_OSR_SETTINGS}")
        new_setting = (
            self._read_byte(_REGISTER_OSR) & 0xC7 | _OSR_SETTINGS.index(oversample) << 3
        )
        self._write_register_byte(_REGISTER_OSR, new_setting)

    @property
    def filter_coefficient(self) -> int:
        """The IIR filter coefficient."""
        return _IIR_SETTINGS[self._read_byte(_REGISTER_CONFIG) >> 1 & 0x07]

    @filter_coefficient.setter
    def filter_coefficient(self, coef: int) -> None:
        if coef not in _IIR_SETTINGS:
            raise ValueError(f"Filter coefficient must be one of: {_IIR_SETTINGS}")
        self._write_register_byte(_REGISTER_CONFIG, _IIR_SETTINGS.index(coef) << 1)

    def reset(self) -> None:
        """Perform a power on reset. All user configuration settings are overwritten
        with their default state.
        """
        self._write_register_byte(_REGISTER_CMD, 0xB6)

    def _read(self) -> tuple[float, float]:
        """Returns a tuple for temperature and pressure."""
        # Perform one measurement in forced mode
        self._write_register_byte(_REGISTER_CONTROL, 0x13)

        # Wait for *both* conversions to complete
        while self._read_byte(_REGISTER_STATUS) & 0x60 != 0x60:
            time.sleep(self._wait_time)

        # Get ADC values
        data = self._read_register(_REGISTER_PRESSUREDATA, 6)
        adc_p = data[2] << 16 | data[1] << 8 | data[0]
        adc_t = data[5] << 16 | data[4] << 8 | data[3]

        # Temperature compensation
        T1, T2, T3 = self._temp_calib

        pd1 = adc_t - T1
        pd2 = pd1 * T2

        temperature = pd2 + (pd1 * pd1) * T3

        # Pressure compensation
        P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11 = self._pressure_calib

        pd1 = P6 * temperature
        pd2 = P7 * temperature**2.0
        pd3 = P8 * temperature**3.0
        po1 = P5 + pd1 + pd2 + pd3

        pd1 = P2 * temperature
        pd2 = P3 * temperature**2.0
        pd3 = P4 * temperature**3.0
        po2 = adc_p * (P1 + pd1 + pd2 + pd3)

        pd1 = adc_p**2.0
        pd2 = P9 + P10 * temperature
        pd3 = pd1 * pd2
        pd4 = pd3 + P11 * adc_p**3.0

        pressure = po1 + po2 + pd4

        # pressure in hPa, temperature in deg C
        return pressure, temperature

    def _read_coefficients(self) -> None:
        """Read & save the calibration coefficients"""
        coeff = bytearray(self._read_register(_REGISTER_CAL_DATA, 21))
        coeff = struct.unpack("<HHbhhbbHHbbhbb", coeff)
        self._temp_calib = (
            coeff[0] / 2**-8.0,  # T1
            coeff[1] / 2**30.0,  # T2
            coeff[2] / 2**48.0,  # T3
        )
        self._pressure_calib = (
            (coeff[3] - 2**14.0) / 2**20.0,  # P1
            (coeff[4] - 2**14.0) / 2**29.0,  # P2
            coeff[5] / 2**32.0,  # P3
            coeff[6] / 2**37.0,  # P4
            coeff[7] / 2**-3.0,  # P5
            coeff[8] / 2**6.0,  # P6
            coeff[9] / 2**8.0,  # P7
            coeff[10] / 2**15.0,  # P8
            coeff[11] / 2**48.0,  # P9
            coeff[12] / 2**48.0,  # P10
            coeff[13] / 2**65.0,  # P11
        )

    def _read_byte(self, register: int) -> int:
        """Read a byte register value and return it"""
        return self._read_register(register, 1)[0]

    def _read_register(self, register: int, length: int) -> bytearray:
        """Read a block of bytes from the sensor"""
        return self._i2c_bus.read_i2c_block_data(self._i2c_address, register, length)

    def _write_register_byte(self, register: int, value: int) -> None:
        """Write a byte to a register"""
        self._i2c_bus.write_byte_data(self._i2c_address, register, value)
