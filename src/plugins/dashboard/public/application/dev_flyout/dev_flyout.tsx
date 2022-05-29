import * as React from 'React';
import {
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import {setDevMode, useDashboardDispatch} from '../state';

export const DevFlyout: React.FC = () => {
  const dispatch = useDashboardDispatch();

  const handleClose = () => {
    dispatch(setDevMode(false));
  };

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
        <EuiText>
          <p>
            This is a dev flyout...
          </p>
        </EuiText>
      </EuiFlyoutBody>
    </EuiFlyout>
  );
};
