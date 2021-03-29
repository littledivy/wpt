// META: title=NativeIO API: Written bytes are read back.
// META: global=window,worker
// META: script=resources/support.js

'use strict';

promise_test(async testCase => {
  await reserveAndCleanupCapacity(testCase);

  const file = await storageFoundation.open('test_file');
  testCase.add_cleanup(async () => {
    await file.close();
    await storageFoundation.delete('test_file');
  });

  var writeBuffer = new Uint8Array(4);
  writeBuffer.set([64, 65, 66, 67]);
  var {buffer: writeBuffer, writtenBytes} = await file.write(writeBuffer, 0);
  assert_equals(
      writtenBytes, 4,
      'NativeIOFile.write() should resolve with the number of bytes written');

  var readBuffer = new Uint8Array(writeBuffer.length);
  var {buffer: readBuffer, readBytes} = await file.read(readBuffer, 0);
  assert_equals(
      readBytes, 4,
      'NativeIOFile.read() should return the number of bytes read');

  assert_array_equals(
      readBuffer, writeBuffer, 'the bytes read should match the bytes written');
}, 'NativeIOFile.read returns bytes written by NativeIOFile.write');

promise_test(async testCase => {
  await reserveAndCleanupCapacity(testCase);
  const file = await createFile(testCase, 'test_file');

  const inputBuffer = new Uint8Array(4);
  const originalByteLength = inputBuffer.byteLength;
  const {buffer: outputBuffer} = await file.read(inputBuffer, 0);

  assert_equals(
      outputBuffer.byteLength, originalByteLength,
      'NativeIOFile.read() should return a buffer with the same byteLength as' +
          'the input buffer');

  assert_equals(
      inputBuffer.byteLength, 0,
      'NativeIOFile.read() should detach the input buffer');
}, 'NativeIOFile.read detaches the input buffer');

promise_test(async testCase => {
  await reserveAndCleanupCapacity(testCase);
  const file = await createFile(testCase, 'test_file');

  const inputBuffer = new Uint8Array(4);
  const originalByteLength = inputBuffer.byteLength;
  const {buffer: outputBuffer} = await file.write(inputBuffer, 0);

  assert_equals(
      outputBuffer.byteLength, originalByteLength,
      'NativeIOFile.write() should return a buffer with the same byteLength as' +
          'the input buffer');

  assert_equals(
      inputBuffer.byteLength, 0,
      'NativeIOFile.write() should detach the input buffer');
}, 'NativeIOFile.write detaches the input buffer');
