import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Share } from "react-native";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Guesses } from "../components/Guesses";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Option } from "../components/Option";
import { PoolCard, PoolPros } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";

import { api } from "../services/api";

interface RouteParams {
  id: string;
}

export function Details() {
  const route = useRoute();
  const toast = useToast();

  const { id } = route.params as RouteParams;
  const [ isLoading, setIsLoading ] = useState(true);
  const [ optionSelected, setOptionSelected ] = useState<'guesses' | 'ranking'>('guesses')
  const [ pollsDetails, setPollsDetails ] = useState<PoolPros>({} as PoolPros)
  
  async function fatchPollDetails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/polls/${id}`);

      setPollsDetails(response.data.poll)
      
    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Falha ao carregar detalhes do bolões.',
        placement: 'top',
        bgColor: 'red.500'
      })

    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: pollsDetails.code
    });
  }

  useEffect(() => {
    fatchPollDetails();
  },[id])

  if(isLoading) {
    return(
      <Loading />
    )
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={pollsDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {
        pollsDetails._count?.participants > 0 ?
          <VStack flex={1} px={5}>
            <PoolHeader data={pollsDetails}/>

            <HStack bgColor="gray.800" p={1} mb={5} rounded="sm">
              <Option 
                title="Seus palpites" 
                isSelected={optionSelected === 'guesses'}
                onPress={() => setOptionSelected('guesses')}
              />
              <Option 
                title="Ranking do grupo" 
                isSelected={optionSelected === 'ranking'}
                onPress={() => setOptionSelected('ranking')}
              />
            </HStack>

            <Guesses poolId={pollsDetails.id} code={pollsDetails.code} />
          </VStack>
          :
          <EmptyMyPoolList code={pollsDetails.code} />
      }

    </VStack>
  )
}