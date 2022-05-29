import * as React from 'React';
import {
  EuiCodeBlock,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiTitle,
  EuiPanel,
  EuiSpacer,
} from '@elastic/eui';
import {setDevMode, useDashboardDispatch} from '../state';
import {DashboardContainer} from '../embeddable';

import {useKibana} from '@kbn/kibana-react-plugin/public';
import {DashboardAppServices} from '../../types';

const formatCode = (input: unknown) => {
  return `import * as React from 'React';
import {Dashboard} from '@kbn/dashboard-plugin/public';

const input = ${JSON.stringify(input)};

export const MyDashboard = () => {
  return <Dashboard input={input} />;
};
`;
};

export interface DevFlyoutProps {
  container: DashboardContainer;
}

export const DevFlyout: React.FC<DevFlyoutProps> = ({container}) => {
  const dispatch = useDashboardDispatch();
  const state = useKibana<DashboardAppServices>();
  const Renderer = state.services.getDashboardContainerByValueRenderer();

  // console.log('Renderer', Renderer);

  const handleClose = () => {
    dispatch(setDevMode(false));
  };

  const input = container.getInput();
  const code = formatCode(input);

  return (
    <EuiFlyout
      ownFocus
      size={'l'}
      onClose={handleClose}
      aria-labelledby={'devFlyout'}
    >
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="m">
          <h2>Dev mode</h2>
        </EuiTitle>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiPanel hasBorder={true} paddingSize='none' title='Code'>
          <EuiCodeBlock language="tsx" fontSize="m" paddingSize="m" isCopyable whiteSpace='pre'>
            {code}
          </EuiCodeBlock>
        </EuiPanel>
        <EuiSpacer />
        <EuiPanel hasBorder={true} title='Preview'>
          <Renderer input={input} />
        </EuiPanel>
      </EuiFlyoutBody>
    </EuiFlyout>
  );
};
