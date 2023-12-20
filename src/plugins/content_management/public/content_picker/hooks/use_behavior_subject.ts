import * as React from 'react';
import type {BehaviorSubject} from 'rxjs';

export const useBehaviorSubject = <T>(subject: BehaviorSubject<T>) => {
  const [value, setValue] = React.useState(subject.value);
  React.useEffect(() => {
    const subscription = subject.subscribe(setValue);
    return () => subscription.unsubscribe();
  }, [subject]);
  return value;
};
