import * as React from 'react';
import type {ContentId} from "../content_picker/types";

export interface ItemViewBaseProps {
  id: ContentId;
  isActive?: boolean;
  onClick?: React.MouseEventHandler;
}
