/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as React from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPageHeader,
  EuiPageSection,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';
import { SelectedPreview } from './selected_preview';
import {ContentId} from '@kbn/content-management-plugin/public/content_picker/types';

export interface RenderPickerProps {
  onPick: (ids: ContentId[]) => void;
}

export interface PickerExampleProps {
  title: string;
  types: string[];
  renderPicker: (props: RenderPickerProps) => React.ReactNode;
}

export const PickerExample: React.FC<PickerExampleProps> = ({ title, types, renderPicker }) => {
  const [ids, setIds] = React.useState<ContentId[]>([]);

  return (
    <>
      <EuiPageSection>
        <EuiPageHeader pageTitle={title} />
      </EuiPageSection>
      <EuiPageSection color="transparent" bottomBorder>
        <EuiFlexGroup gutterSize="l">
          <EuiFlexItem>
            <EuiTitle size="xs">
              <h5>Content Picker</h5>
            </EuiTitle>
            <EuiSpacer size={'s'} />
            {renderPicker({
              onPick: (ids) => {
                setIds(ids);
              },
            })}
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiTitle size="xs">
              <h5>Selected</h5>
            </EuiTitle>
            <EuiSpacer size={'s'} />
            <SelectedPreview ids={ids} />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPageSection>
    </>
  );
};
