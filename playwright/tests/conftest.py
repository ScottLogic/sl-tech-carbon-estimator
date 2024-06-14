import pytest
import shutil
from xprocess import ProcessStarter

@pytest.fixture(autouse=True, scope="session")
def estimator_server(xprocess):
    class Starter(ProcessStarter):
        # startup pattern
        pattern = "Application bundle generation complete."

        # command to start process
        args = [shutil.which('npm'), 'start']

        terminate_on_interrupt = True

    # ensure process is running and return its logfile
    logfile = xprocess.ensure("estimator", Starter)

    yield

    # clean up whole process tree afterwards
    xprocess.getinfo("estimator").terminate()