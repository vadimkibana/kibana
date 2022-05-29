import * as React from 'React';
import {
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiTitle,
} from '@elastic/eui';
import {setDevMode, useDashboardDispatch} from '../state';
import {CodeEditor} from '@kbn/kibana-react-plugin/public';
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
        <CodeEditor value={code} languageId='typescript' height={500} onChange={() => {}} options={{wordWrap: 'off'}} />
        <Renderer input={input} />
      </EuiFlyoutBody>
    </EuiFlyout>
  );
};
