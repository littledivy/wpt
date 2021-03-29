// META: title=NativeIO API: Transferred buffer is of the same type as input.
// META: global=dedicatedworker
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

test(testCase => {
  reserveAndCleanupCapacitySync(testCase);
  const file = createFileSync(testCase, 'test_file');

  for (const view of views) {
    const inputBuffer = new view(4);
    const {buffer: outputBuffer} = file.write(inputBuffer, 0);

    assert_true(
        outputBuffer instanceof view,
        'NativeIOFileSync.Write() should return a buffer of the same type as ' +
            'the input');
  }
}, 'NativeIOFileSync.Write returns the right ArrayBufferView type');

test(testCase => {
  reserveAndCleanupCapacitySync(testCase);
  const file = createFileSync(testCase, 'test_file');

  const inputBuffer = new DataView(new ArrayBuffer(4));
  const {buffer: outputBuffer} = file.write(inputBuffer, 0);

  assert_true(
      outputBuffer instanceof DataView,
      'NativeIOFileSync.Write() should return a DataView buffer');
}, 'NativeIOFileSync.Write returns a DataView buffer when given a DataView ' +
       'buffer');

test(testCase => {
  reserveAndCleanupCapacitySync(testCase);
  const file = createFileSync(testCase, 'test_file');

  for (const view of views) {
    const inputBuffer = new view(4);
    const {buffer: outputBuffer} = file.read(inputBuffer, 0);

    assert_true(
        outputBuffer instanceof view,
        'NativeIOFileSync.Read() should return a buffer of the same type as ' +
            'the input');
  }
}, 'NativeIOFile.Read returns the right ArrayBufferView type');

test(testCase => {
  reserveAndCleanupCapacitySync(testCase);
  const file = createFileSync(testCase, 'test_file');

  const inputBuffer = new DataView(new ArrayBuffer(4));
  const {buffer: outputBuffer} = file.read(inputBuffer, 0);

  assert_true(
      outputBuffer instanceof DataView,
      'NativeIOFileSync.Read() should return a DataView buffer');
}, 'NativeIOFileSync.Read returns a DataView buffer when given a DataView ' +
       'buffer');
