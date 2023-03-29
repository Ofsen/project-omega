import React from 'react';
import {Pressable, Text, View} from 'react-native';
import styled from 'styled-components';
import {Button} from '../../Button';
import TextField from '../TextField';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../../contexts/authContext';

const SignUpForm = () => {
  const navigation = useNavigation();
  const {Signup} = useAuth();
  const [form, setForm] = React.useState({email: '', password: '', error: ''});

  const handleLogin = async () => {
    if (form.email.length < 3 || form.password.length < 8) {
      return setForm(prev => ({...prev, error: 'Invalid email or password'}));
    }

    setForm(prev => ({...prev, error: ''}));
    try {
      await Signup(form.email, form.password);
    } catch (error) {
      setForm(prev => ({
        ...prev,
        error: error.message,
      }));
    }
  };

  return (
    <FormContainer>
      {!!form.error && (
        <ErrorContainer>
          <TextError>{form.error}</TextError>
        </ErrorContainer>
      )}
      <TextField
        label="Email"
        placeholder="user123@mail.com"
        keyboardType="email-address"
        change={text => setForm(prev => ({...prev, email: text}))}
        value={form.email}
      />
      <TextField
        label="Mot de passe"
        placeholder="***"
        type="password"
        change={text => setForm(prev => ({...prev, password: text}))}
        value={form.password}
      />
      <View style={{marginTop: 12}}>
        <Button label="S'inscrire" pressHandler={handleLogin} />
      </View>
      <Pressable onPress={() => navigation.navigate('Login')}>
        <LinkText>Déja inscrit ? se connecter</LinkText>
      </Pressable>
    </FormContainer>
  );
};

export default SignUpForm;

const FormContainer = styled.View`
  width: 70%;
  margin-top: 16px;
  gap: 16px;
`;

const LinkText = styled.Text`
  color: ${({theme}) => theme.blue};
  font-weight: bold;
  text-align: center;
  margin-top: 16px;
`;

const ErrorContainer = styled.View`
  background-color: ${({theme}) => theme.red};
  padding: 16px;
  margin-top: 8px;
`;

const TextError = styled.Text`
  color: white;
`;
