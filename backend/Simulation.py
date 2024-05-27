import numpy as np
from Operations import Operations

class DistanceSensor:

    operations = Operations()
    def __init__(self, probe_signal_term, buffer_length, sample_rate, signal_velocity, report_term, starting_distance):
        self.probe_signal_term = probe_signal_term
        self.buffer_length = buffer_length
        self.sample_rate = sample_rate
        self.signal_velocity = signal_velocity
        self.last_calculation_timestamp = 0
        self.report_term = report_term
        self.discrete_probe_signal = None
        self.discrete_feedback_signal = None
        self.correlation_signal = None
        self.distance = starting_distance

    def generate_probe_signal(self, timestamp):
        time = np.linspace(0, 4, int(self.buffer_length * self.sample_rate), endpoint=False)
        s1 = 1 * np.sin((2 * np.pi / self.probe_signal_term) * (time - 0))  # SinusoidalSignal
        s2 = []
        for t in time:
            k = int((t / (self.probe_signal_term / 3)) - (0 / (self.probe_signal_term / 3)))
            if (k * (self.probe_signal_term / 3) + 0) <= t < (0.3 * (self.probe_signal_term / 3) + k * (self.probe_signal_term / 3) + 0):
                s2.append(1)
            else:
                s2.append(0)
        finalSignal = []

        for i in range(len(s1)):
            finalSignal.append((s1[i] + s2[i]))

        return finalSignal

    def update(self, feedback_signal, timestamp):
        self.discrete_probe_signal = self.generate_probe_signal(timestamp)
        self.discrete_feedback_signal = feedback_signal
        if timestamp - self.last_calculation_timestamp >= self.report_term:
            self.last_calculation_timestamp = timestamp
            self.calculate_distance()

    def calculate_distance(self):
        # self.correlation_signal = np.correlate(self.discrete_feedback_signal, self.discrete_probe_signal, mode='full')
        self.correlation_signal = self.operations.Correlation(self.discrete_feedback_signal, self.discrete_probe_signal)
        n = len(self.correlation_signal)
        indexOfFirstMax = n // 2
        for i in range(indexOfFirstMax + 1, n):
            if self.correlation_signal[i] > self.correlation_signal[indexOfFirstMax]:
                indexOfFirstMax = i
        delay = (indexOfFirstMax - n // 2) / self.sample_rate
        self.distance = delay * self.signal_velocity / 2.0

class Environment:
    def __init__(self, time_step, sample_rate, signal_velocity, item_velocity, distance_sensor, start_item_distance):
        self.time_step = time_step
        self.sample_rate = sample_rate
        self.signal_velocity = signal_velocity
        self.item_velocity = item_velocity
        self.distance_sensor = distance_sensor
        self.item_distance = start_item_distance
        self.timestamp = 0

    def step(self):
        self.timestamp += self.time_step
        self.item_distance += self.item_velocity * self.time_step
        delay = self.item_distance / self.signal_velocity * 2.0
        probe_signal = self.distance_sensor.generate_probe_signal(timestamp=self.timestamp)
        probe_signal = np.roll(probe_signal, int(delay * self.sample_rate))
        self.distance_sensor.update(probe_signal, self.timestamp)
