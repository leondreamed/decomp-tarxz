import fs from "fs";
import test from "ava";
import isJpg from "is-jpg";
import decompressTarxz from "./index.js";
import { join, filename } from "desm";

test("extract file", async (t) => {
  const buf = await fs.promises.readFile(
    join(import.meta.url, "fixture.tar.xz")
  );
  const files = await decompressTarxz()(buf);

  t.is(files[0].path, "test.jpg");
  t.true(isJpg(files[0].data));
});

test("extract file using streams", async (t) => {
  const stream = fs.createReadStream(join(import.meta.url, "fixture.tar.xz"));
  const files = await decompressTarxz()(stream);

  t.is(files[0].path, "test.jpg");
  t.true(isJpg(files[0].data));
});

test("return empty array if non-valid file is supplied", async (t) => {
  const buf = await fs.promises.readFile(filename(import.meta.url));
  const files = await decompressTarxz()(buf);

  t.is(files.length, 0);
});

test("throw on wrong input", async (t) => {
  await t.throwsAsync(() => decompressTarxz()("foo"), {
    message: "Expected a Buffer or Stream, got string",
  });
});
