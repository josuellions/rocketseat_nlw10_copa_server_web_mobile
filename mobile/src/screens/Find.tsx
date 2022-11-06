import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { VStack, Text, Heading, useToast, useSafeArea } from "native-base";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Botton";

import Logo from '../assets/logo.svg';

import { api } from "../services/api";

export function Find() {
  const toast = useToast();
  const { navigate } = useNavigation();
  const [ code, setCode ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);

  async function handleJoinPoll() {
    try {
      setIsLoading(true);
      
      if(!code.trim()){
        return toast.show({
          title: 'Informe o código.',
          placement: 'top',
          bgColor: 'yellow.500',
        });
      }

      await api.post('/polls/join', { code });

      toast.show({
        title: 'Você entrou no bolão com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      });

      setCode('');
      setIsLoading(false);
      navigate('polls');

    } catch (error) {
      console.log(error);
      setIsLoading(false);

      if(error.response?.data?.message === 'Poll not found!') {
        return toast.show({
          title: 'Não foi possível encontrar o bolão.',
          placement: 'top',
          bgColor: 'red.500'
        });
      }

      if(error.response?.data?.message === 'You already joined this poll.') {
        return toast.show({
          title: 'Você já está nesse bolão!',
          placement: 'top',
          bgColor: 'red.500'
        });
      }

      toast.show({
        title: 'Não foi possível encontrar o bolão.',
        placement: 'top',
        bgColor: 'red.500'
      });
    }
  }

  return(
    <VStack  flex={1} bgColor="gray.900">
      <Header
        title="Buscar por código"
        showBackButton
      />
      <VStack mt={8} mx={5} alignItems='center'>
        <Logo />

        <Heading fontFamily="heading" color="white" fontSize="xl" textAlign="center" my={8}>
          Encontre um bolão através de {'\n'} seu código único
        </Heading>
      </VStack>
      
      <Input 
        mb={2}
        autoCapitalize="characters"
        onChangeText={setCode}
        placeholder="Qual código do bolão?"
      />

      <Button
        isLoading={isLoading}
        title="BUSCAR BOLÃO"
        onPress={handleJoinPoll}
      />

      <Text color='gray.200' fontSize='sm' textAlign="center" px={10} mt={4}>
        Encontre o seu bolão, e realize o seus palpites para cada jogo que escolher
      </Text>
    </VStack>
  )
}