import React from 'react';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/Octicons';
import {View} from 'react-native';

const Touchable = styled.Pressable`
  width: 100%;
  padding: 14px 20px;
  background-color: ${props =>
    props.outline ? 'transparent' : props.theme[props.variant]};

  ${props => props.outline && 'border: 2px solid ' + props.theme[props.variant]}
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => (props.outline ? props.theme[props.variant] : 'white')};
  text-align: center;
`;

export const Button = props => {
  const {
    label,
    pressHandler,
    variant = 'primary',
    outline = false,
    icon = null,
  } = props;

  return (
    <Touchable onPress={pressHandler} variant={variant} outline={outline}>
      <Label outline={outline} variant={variant}>
        {label}
        {icon && (
          <>
            {' '}
            <Icon name={icon} size={16} color={'white'} />
          </>
        )}
      </Label>
    </Touchable>
  );
};
