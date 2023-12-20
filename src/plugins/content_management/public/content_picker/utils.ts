import type {ContentId} from "./types";

export const compareId = (a: ContentId | null | undefined, b: ContentId | null | undefined): boolean => {
  return a instanceof Array && b instanceof Array && (a[0] === b[0] && a[1] === b[1]);
};
