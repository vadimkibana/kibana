/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as React from 'react';
import {FancySelect} from '../../../../components/fancy_select';

export type Format = 'encoded' | 'beats' | 'logstash';

export interface FormatSelectProps {
  value: Format;
  onChange: (value: Format) => void;
}

export const FormatSelect: React.FC<FormatSelectProps> = ({ value, onChange}) => {
  return (
    <FancySelect
      value={value}
      options={[
        {
          id: 'encoded',
          icon: 'key',
          title: 'Encoded',
          description: 'Format used to make requests to Elasticsearch REST API.',
        },
        {
          id: 'beats',
          icon: 'logoBeats',
          title: 'Beats',
          description: 'Format used to configure Beats.',
        },
        {
          id: 'logstash',
          icon: 'logoLogstash',
          title: 'Logstash',
          description: 'Format used to configure Logstash.',
        },
      ]}
      onChange={(value) => onChange(value as Format)}
    />
  );
};
