import { useState } from "react";
import { VStack, Text, Heading, useToast } from "native-base";

import { Input } from "../components/Input";
import { Button } from "../components/Botton";
import { Header } from "../components/Header";

import Logo from '../assets/logo.svg';
import { api } from "../services/api";

export function New() {
  const toast = useToast();
  const [ title, setTitle  ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);
  async function handlePollCreate() {
    if(!title.trim()) {
      //Alert.alert('Novo bolão', 'Informe um nome para seu bolão')
      return toast.show({
        title: 'Informe um nome para seu bolão!',
        placement: 'top',
        bgColor: 'red.500'
      })
    }
    try {
      setIsLoading(true);

      await api.post('/polls', { title: title.toUpperCase() });

      toast.show({
        title: 'Bolão criado com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      })

      setTitle('');

    } catch (error) { 
      console.log(error);

      toast.show({
        title: 'Falha ao criar seu bolão, tente mais tarde.',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally{
      setIsLoading(false);
    }
  }

  return(
    <VStack  flex={1} bgColor="gray.900">
      <Header
        title="Criar novo bolão"
        showBackButton
      />
      <VStack mt={8} mx={5} alignItems='center'>
        <Logo />

        <Heading fontFamily="heading" color="white" fontSize="xl" textAlign="center" my={8}>
          Crie seu próprio bolão da copa e {'\n'} compartilhe entre amigos!
        </Heading>
      </VStack>
      
      <Input 
        mb={2}
        value={title}
        onChangeText={setTitle}
        placeholder="Qual nome do seu bolão?"
      />

      <Button
        isLoading={isLoading}
        title="CRIAR MEU BOLÃO"
        onPress={handlePollCreate}
      />

      <Text color='gray.200' fontSize='sm' textAlign="center" px={10} mt={4}>
        Após criar seu bolão, você receberá um código único que podera ser usado para convidar outras pessoas
      </Text>
    </VStack>
  )
}