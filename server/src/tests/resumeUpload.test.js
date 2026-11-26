import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { getResumeFileKind, fileFilter } from '../middleware/upload.middleware.js';
import { errorHandler } from '../middleware/error.middleware.js';

process.env.NODE_ENV = 'test';

describe('Resume upload file types', () => {
  test('detects the type from the extension, not the mimetype', () => {
    assert.equal(getResumeFileKind('cv.pdf'), 'pdf');
    assert.equal(getResumeFileKind('CV.PDF'), 'pdf');
    assert.equal(getResumeFileKind('notes.txt'), 'text');
  });

  test('returns null for .doc, .docx and executables', () => {
    assert.equal(getResumeFileKind('cv.docx'), null);
    assert.equal(getResumeFileKind('cv.doc'), null);
    assert.equal(getResumeFileKind('evil.exe'), null);
    assert.equal(getResumeFileKind(''), null);
  });

  test('fileFilter accepts a pdf regardless of mimetype', () => {
    let result;
    fileFilter({}, { originalname: 'cv.pdf', mimetype: 'application/octet-stream' }, (err, ok) => {
      result = { err, ok };
    });
    assert.equal(result.err, null);
    assert.equal(result.ok, true);
  });

  test('fileFilter rejects .exe with a 415 error', () => {
    let result;
    fileFilter({}, { originalname: 'evil.exe', mimetype: 'application/x-msdownload' }, (err, ok) => {
      result = { err, ok };
    });
    assert.equal(result.ok, false);
    assert.equal(result.err.statusCode, 415);
  });

  test('errorHandler turns the rejection into a 415 response, not a 500', () => {
    let status;
    let body;
    const res = {
      statusCode: 200,
      status(c) { status = c; return this; },
      json(d) { body = d; return this; },
    };
    let err;
    fileFilter({}, { originalname: 'cv.docx' }, (e) => { err = e; });
    errorHandler(err, { method: 'POST', originalUrl: '/api/resume/upload' }, res, () => {});
    assert.equal(status, 415);
    assert.match(body.message, /Unsupported file type/);
  });
});
