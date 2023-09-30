import decompressTar from "decomp-tar";
import fileType from "file-type";
import { isStream } from "is-stream";
import { decompress } from "@napi-rs/lzma/xz";
import { getStreamAsBuffer } from "get-stream";

export default () => async (input) => {
  const isBuffer = Buffer.isBuffer(input);
  const type = isBuffer ? fileType(input) : null;

  if (!isBuffer && !isStream(input)) {
    return Promise.reject(
      new TypeError(`Expected a Buffer or Stream, got ${typeof input}`)
    );
  }

  if (isBuffer && (!type || type.ext !== "xz")) {
    return Promise.resolve([]);
  }

  let result;
  if (isBuffer) {
    result = await decompress(input);
  } else {
    result = await decompress(await getStreamAsBuffer(input));
  }

  return decompressTar()(result);
};
