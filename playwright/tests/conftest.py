import pytest
from xprocess import ProcessStarter

@pytest.fixture(autouse=True, scope="session")
def estimator_server(xprocess):
    class Starter(ProcessStarter):
        # startup pattern
        pattern = "Application bundle generation complete."

        # command to start process
        args = ['sh', 'npm', 'start']

    # ensure process is running and return its logfile
    logfile = xprocess.ensure("estimator", Starter)

    yield

    # clean up whole process tree afterwards
    xprocess.getinfo("estimator").terminate()