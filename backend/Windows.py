import numpy as np

functions = {
    1: lambda M: 1,
    2: lambda M: np.hamming(M),
    3: lambda M: np.hanning(M),
    4: lambda M: np.blackman(M)
}

