import type {ContentId} from "../content_picker/types";

export interface ContentTypeCommonFields {
  id: ContentId;
  /** Human-readable name of the content type. */
  title?: string;
  /** Human-readable description of the content type. */
  description?: string;
  /** EUI icon string. */
  icon?: string;
  /** Timestamp, when item was created. */
  createdAt?: number;
  /** Timestamp, when item was updated. */
  updatedAt?: number;
}

export type CommonFieldsMapper<T extends unknown> = (item: T) => Omit<ContentTypeCommonFields, 'id'>;
