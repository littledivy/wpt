// META: title=NativeIO API: Transferred buffer is of the same type as input.
// META: global=window,worker
// META: script=resources/support.js

'use strict';

const views = [
  Int8Array,
  Uint8Array,
  Uint8ClampedArray,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  BigInt64Array,
  BigUint64Array,
];

promise_test(async testCase => {
  await reserveAndCleanupCapacity(testCase);
  const file = await createFile(testCase, 'test_file');

  for (const view of views) {
    const inputBuffer = new view(4);
    const {buffer: outputBuffer} = await file.write(inputBuffer, 0);

    assert_true(
        outputBuffer instanceof view,
        'NativeIOFile.Write() should return a buffer of the same type as the ' +
          'input');
  }
}, 'NativeIOFile.Write returns the right ArrayBufferView type');

promise_test(async testCase => {
  await reserveAndCleanupCapacity(testCase);
  const file = await createFile(testCase, 'test_file');

  const inputBuffer = new DataView(new ArrayBuffer(4));
  const {buffer: outputBuffer} = await file.write(inputBuffer, 0);

  assert_true(
      outputBuffer instanceof DataView,
      'NativeIOFile.Write() should return a DataView buffer');
}, 'NativeIOFile.Write returns a DataView buffer when given a DataView buffer');

promise_test(async testCase => {
  await reserveAndCleanupCapacity(testCase);
  const file = await createFile(testCase, 'test_file');

  for (const view of views) {
    const inputBuffer = new view(4);
    const {buffer: outputBuffer} = await file.read(inputBuffer, 0);

    assert_true(
        outputBuffer instanceof view,
        'NativeIOFile.Read() should return a buffer of the same type as the ' +
          'input');
  }
}, 'NativeIOFile.Read returns the right ArrayBufferView type');

promise_test(async testCase => {
  await reserveAndCleanupCapacity(testCase);
  const file = await createFile(testCase, 'test_file');

  const inputBuffer = new DataView(new ArrayBuffer(4));
  const {buffer: outputBuffer} = await file.read(inputBuffer, 0);

  assert_true(
      outputBuffer instanceof DataView,
      'NativeIOFile.Read() should return a DataView buffer');
}, 'NativeIOFile.Read returns a DataView buffer when given a DataView buffer');
