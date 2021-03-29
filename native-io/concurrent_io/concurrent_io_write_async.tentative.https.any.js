// META: title=NativeIO API: Concurrent IO while write is resolving.
// META: global=window,worker
// META: script=operation_helpers.js
// META: script=../resources/support.js
// META: timeout=long

'use strict';

// See documentation in operation_helpers.js

for (let op of kOperations) {
  promise_test(async testCase => {
    await reserveAndCleanupCapacity(testCase);

    const file = await createFile(testCase, 'write_file');

    var writeBuffer = new Uint8Array(4);
    writeBuffer.set([96, 97, 98, 99]);
    const res = op.prepare();

    const writePromise = file.write(writeBuffer, 0);
    await op.assertRejection(testCase, file, res);

    var {buffer: writeBuffer, writtenBytes} = await writePromise;
    assert_equals(writtenBytes, 4);

    var readBuffer = new Uint8Array(4);
    var {buffer: readBuffer, readBytes} = await file.read(readBuffer, 0);

    assert_equals(readBytes, 4,
                  `NativeIOFile.read() should not fail after a rejected ` +
                    `${op.name} during write()`);
    assert_array_equals(readBuffer, writeBuffer,
                        `Rejecting ${op.name} during write() should still ` +
                          `complete the write.`);
    op.assertUnchanged(res);
  }, `${op.name}() rejects while write() is resolving.`);
};
