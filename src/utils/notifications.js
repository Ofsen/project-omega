import React from 'react';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/Ionicons';

export const warn = message => {
  showMessage({
    message: 'Attention',
    description: message,
    type: 'warning',
    icon: props => (
      <Icon {...props} name="md-information-circle-outline" size={20} />
    ),
  });
};

export const error = message => {
  showMessage({
    message: 'Erreur',
    description: message,
    type: 'danger',
    icon: props => <Icon {...props} name="warning" size={20} />,
  });
};

export const success = message => {
  showMessage({
    message: 'Bien',
    description: message,
    type: 'success',
    icon: props => <Icon {...props} name="checkmark" size={20} />,
  });
};
