import { useCallback, useEffect, useState } from "react";
import { VStack, Icon, useToast, FlatList } from "native-base";
import { useNavigation, useIsFocused, useFocusEffect } from "@react-navigation/native";
import { Octicons } from '@expo/vector-icons';

import { Header } from "../components/Header";
//import { Input } from "../components/Input";
import { Button } from "../components/Botton";
import { PoolCard, PoolPros } from '../components/PoolCard';
import { Loading } from "../components/Loading";

//import Logo from '../assets/logo.svg';
import { api } from "../services/api";
import { EmptyPoolList } from "../components/EmptyPoolList";

export function Pools() {
  const toast = useToast();
  const { navigate } = useNavigation();
  const [ isLoading, setIsLoading ] = useState(true);
  const [ polls, setPolls ] = useState<PoolPros[]>([]);

  async function fetchPolls() {
    try {
      setIsLoading(true);
      const response = await api.get('/polls');

      setPolls(response.data.polls);
    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Falha ao carregar os bolões.',
        placement: 'top',
        bgColor: 'red.500'
      })
    }finally{
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPolls();
  },[]));

  return(
    <VStack  flex={1} bgColor="gray.900">
      <Header
        title="Meus bolões"
        
      />
        
      <VStack mt={6} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>

        <Button
          onPress={() => navigate('find')}
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md"/>}
        />
      </VStack>
      {isLoading ? (
        <Loading />
      ):(
        <FlatList
          data={polls}
          keyExtractor={item => item.id}
          renderItem={({ item }) => 
            <PoolCard data={item}
            onPress={() => navigate('details', { id: item.id })}
          />}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{pb: 20}}
          ListEmptyComponent={() => <EmptyPoolList />}
          px={10}
        />
      )
      }
    </VStack>
  )
}