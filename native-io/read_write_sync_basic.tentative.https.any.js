// META: title=Synchronous NativeIO API: Written bytes are read back.
// META: global=dedicatedworker
// META: script=resources/support.js

'use strict';


test(testCase => {
  reserveAndCleanupCapacitySync(testCase);

  const file = storageFoundation.openSync('test_file');
  testCase.add_cleanup(() => {
    file.close();
    storageFoundation.deleteSync('test_file');
  });

  var writeBuffer = Uint8Array.from([64, 65, 66, 67]);
  var {buffer: writeBuffer, writtenBytes} = file.write(writeBuffer, 0);
  assert_equals(
      writtenBytes, 4,
      'NativeIOFileSync.write() should resolve with the number of bytes written');

  var readBuffer = new Uint8Array(writeBuffer.length);
  var {buffer: readBuffer, readBytes} = file.read(readBuffer, 0);
  assert_equals(
      readBytes, 4,
      'NativeIOFileSync.read() should return the number of bytes read');

  assert_array_equals(
      readBuffer, writeBuffer, 'the bytes read should match the bytes written');
}, 'NativeIOFileSync.read returns bytes written by NativeIOFileSync.write');

test(testCase => {
  reserveAndCleanupCapacitySync(testCase);
  const file = createFileSync(testCase, 'test_file');

  const inputBuffer = new Uint8Array(4);
  const originalByteLength = inputBuffer.byteLength;
  const {buffer: outputBuffer} = file.read(inputBuffer, 0);

  assert_equals(
      outputBuffer.byteLength, originalByteLength,
      'NativeIOFileSync.read() should return a buffer with the same' +
          'byteLength as the input buffer');

  assert_equals(
      inputBuffer.byteLength, 0,
      'NativeIOFileSync.read() should detach the input buffer');
}, 'NativeIOFileSync.read detaches the input buffer');

test(testCase => {
  reserveAndCleanupCapacitySync(testCase);
  const file = createFileSync(testCase, 'test_file');

  const inputBuffer = new Uint8Array(4);
  const originalByteLength = inputBuffer.byteLength;
  const {buffer: outputBuffer} = file.write(inputBuffer, 0);

  assert_equals(
      outputBuffer.byteLength, originalByteLength,
      'NativeIOFileSync.write() should return a buffer with the same' +
          'byteLength as the input buffer');

  assert_equals(
      inputBuffer.byteLength, 0,
      'NativeIOFileSync.write() should detach the input buffer');
}, 'NativeIOFileSync.write detaches the input buffer');
